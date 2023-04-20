# This is a self-documenting Makefile, see https://www.thapaliya.com/en/writings/well-documented-makefiles/
default: help
JSONNET_VENDOR_DIR := vendor_jsonnet

GRAFANA_PLUGIN_ID := $(shell jq -r '.id' src/plugin.json)
GRAFANA_PLUGIN_VERSION := $(shell jq -r '.version' package.json)
GRAFANA_PLUGIN_ARTIFACT := $(GRAFANA_PLUGIN_ID)-$(GRAFANA_PLUGIN_VERSION).zip
GRAFANA_PLUGIN_ARTIFACT_CHECKSUM := $(GRAFANA_PLUGIN_ARTIFACT).md5
GRAFANA_IMAGE := docker.io/grafana/grafana


##@ Dependencies

$(JSONNET_VENDOR_DIR): jsonnetfile.json jsonnetfile.lock.json
	jb --jsonnetpkg-home="$(JSONNET_VENDOR_DIR)" install

deps-dashboards: $(JSONNET_VENDOR_DIR) ## Install jsonnet dependencies

node_modules: package.json yarn.lock
	yarn install

deps-frontend: node_modules ## Install Node.js dependencies

deps-backend: ## Install Go dependencies
	go get ./pkg

deps: deps-dashboards deps-frontend deps-backend ## Install all dependencies


##@ Development

dev-frontend: deps-frontend ## Build frontend data sources (development)
	yarn run dev

watch-frontend: deps-frontend build-dashboards ## Auto rebuilt frontend on file changes
	yarn run watch

dev-backend: deps-backend
	go build -race -o ./dist/datasources/redis/pcp_redis_datasource_$$(go env GOOS)_$$(go env GOARCH) -tags netgo -ldflags -w ./pkg

restart-backend: ## Rebuild and restart backend data source (as root)
	sudo -u "$$(stat -c '%U' .)" make dev-backend
	killall pcp_redis_datasource_$$(go env GOOS)_$$(go env GOARCH)


##@ Build

dist/%.json: src/%.jsonnet $(JSONNET_VENDOR_DIR)
	mkdir -p $(dir $@)
	jsonnet -J "$(JSONNET_VENDOR_DIR)" -o $@ $<

build-dashboards: $(shell find src -name '*.jsonnet' | sed -E 's@src/(.+)\.jsonnet@dist/\1.json@g') ## Build Grafana dashboards from jsonnet

build-frontend: deps-frontend ## Build frontend data sources
	yarn run build

	# check for javascript greater than 1 MB
	test $$(find dist/ -name '*.js' -size +1024k | wc -l) -eq 1 || exit 1

GO_LD_FLAGS := -w -s -extldflags "-static"
build-backend: deps-backend ## Build backend data source
	#mage buildAll
	for arch in amd64 arm arm64 s390x ppc64le 386; do \
	  CGO_ENABLED=0 GOOS=linux GOARCH=$${arch} go build -o dist/datasources/redis/pcp_redis_datasource_linux_$${arch} -ldflags '$(GO_LD_FLAGS)' ./pkg; \
	done
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o dist/datasources/redis/pcp_redis_datasource_darwin_amd64 -ldflags '$(GO_LD_FLAGS)' ./pkg
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o dist/datasources/redis/pcp_redis_datasource_windows_amd64.exe -ldflags '$(GO_LD_FLAGS)' ./pkg

build: build-dashboards build-frontend build-backend ## Build everything

zip:
	rm -rf build && mkdir build
	cp -a dist "build/$(GRAFANA_PLUGIN_ID)"
	cd build && zip -r "$(GRAFANA_PLUGIN_ARTIFACT)" "$(GRAFANA_PLUGIN_ID)"
	cd build && md5sum "$(GRAFANA_PLUGIN_ARTIFACT)" > "$(GRAFANA_PLUGIN_ARTIFACT_CHECKSUM)"
	rm -r "build/$(GRAFANA_PLUGIN_ID)"


##@ Test

test-frontend: deps-frontend ## Run frontend tests
	yarn run test

test-frontend-watch: deps-frontend ## Run frontend tests (watch mode)
	yarn run test --watch

test-frontend-coverage: deps-frontend ## Run frontend tests with coverage
	yarn run test --coverage

test-backend: deps-backend ## Run backend tests
	go test -race ./pkg/...

test-backend-coverage: deps-backend ## Run backend tests with coverage
	go test -race -coverprofile=coverage.out ./pkg/...
	go tool cover -html=coverage.out

test: test-frontend test-backend ## Run all tests


##@ UI tests

test-ui-start-pod: ## Start PCP and Redis in a pod
	-podman pod rm -f grafana-pcp-tests
	podman pod create --name grafana-pcp-tests -p 3001:3000
	podman run --pod grafana-pcp-tests --name grafana-pcp-tests-pcp -d --systemd always quay.io/performancecopilot/pcp
	podman run --pod grafana-pcp-tests --name grafana-pcp-tests-redis -d docker.io/library/redis:6

test-ui-start-grafana-dist: ## Start Grafana with grafana-pcp from the dist/ folder
	podman run --pod grafana-pcp-tests --name grafana-pcp-tests-grafana -d --replace \
		-e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="performancecopilot-pcp-app,performancecopilot-redis-datasource,performancecopilot-vector-datasource,performancecopilot-bpftrace-datasource,performancecopilot-flamegraph-panel,performancecopilot-breadcrumbs-panel,performancecopilot-troubleshooting-panel" \
		-v $$(pwd)/dist:/var/lib/grafana/plugins/performancecopilot-pcp-app \
		$(GRAFANA_IMAGE)

test-ui-start-grafana-build: ## Start Grafana with grafana-pcp from build/performancecopilot-pcp-app-*.zip
	podman run --pod grafana-pcp-tests --name grafana-pcp-tests-grafana -d --replace \
		-e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="performancecopilot-pcp-app,performancecopilot-redis-datasource,performancecopilot-vector-datasource,performancecopilot-bpftrace-datasource,performancecopilot-flamegraph-panel,performancecopilot-breadcrumbs-panel,performancecopilot-troubleshooting-panel" \
		-e GF_INSTALL_PLUGINS="/tmp/plugin.zip;performancecopilot-pcp-app" \
		-v $$(pwd)/build/$$(basename build/performancecopilot-pcp-app-*.zip):/tmp/plugin.zip \
		$(GRAFANA_IMAGE)

test-ui: test-ui-start-pod ## Run Cypress UI tests
	CYPRESS_BASE_URL="http://127.0.0.1:3001" RESET_GRAFANA_CMD="make test-ui-start-grafana-dist" yarn cypress:open


##@ Helpers

sign: ## Sign the plugin
	yarn run sign

jsonnetfmt: ## Run jsonnetfmt on all jsonnet files
	jsonnetfmt -i $$(find . -name '*.jsonnet')

plugincheck: ## Run Grafana plugincheck on the plugin zip file
	plugincheck2 build/*.zip

clean: ## Clean all artifacts
	rm -rf node_modules "$(JSONNET_VENDOR_DIR)" dist build

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

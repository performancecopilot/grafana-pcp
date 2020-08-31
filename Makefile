# This is a self-documenting Makefile, see https://www.thapaliya.com/en/writings/well-documented-makefiles/
default: help
JSONNET_VENDOR_DIR := vendor_jsonnet


##@ Dependencies

deps-dashboards: jsonnetfile.json ## Install jsonnet dependencies
	jb --jsonnetpkg-home="$(JSONNET_VENDOR_DIR)" install

deps-frontend: package.json ## Install Node.js dependencies
	yarn install
	sed -i 's@results.push(createIgnoreResult(filePath, cwd));@// &@' node_modules/eslint/lib/cli-engine/cli-engine.js

deps-backend: ## Install Go dependencies
	go get ./pkg

deps: deps-dashboards deps-frontend deps-backend ## Install all dependencies


##@ Development

dev-frontend: deps-frontend ## Build frontend datasources (development)
	yarn run dev

watch-frontend: deps-frontend dist-dashboards ## Auto rebuilt frontend on file changes
	$(YARN) run watch

dev-backend: deps-backend
	go build -o ./dist/datasources/redis/pcp_redis_datasource_$$(go env GOOS)_$$(go env GOARCH) -tags netgo -ldflags -w ./pkg

restart-backend: ## Rebuild and restart backend datasource (as root)
	sudo -u "$$(stat -c '%U' .)" make dev-backend
	killall pcp_redis_datasource_$$(go env GOOS)_$$(go env GOARCH)


##@ Build

dist/dashboards/%.json: src/dashboards/%.jsonnet deps-dashboards
	mkdir -p $(dir $@)
	jsonnet -J "$(JSONNET_VENDOR_DIR)" -o $@ $<

dist-dashboards: deps-dashboards $(shell find src/dashboards -name '*.jsonnet' | sed -E 's@src/(.*)\.jsonnet@dist/\1.json@g') ## Build Grafana dashboards from jsonnet

dist-frontend: deps-frontend ## Build frontend datasources
	yarn run build

dist-backend: deps-backend ## Build backend datasource
	go build -o ./dist/datasources/redis/pcp_redis_datasource_$$(go env GOOS)_$$(go env GOARCH) -tags netgo -ldflags -w ./pkg

dist: dist-dashboards dist-frontend dist-backend ## Build everything


##@ Test

test-frontend: deps-frontend ## Run frontend tests
	yarn run test

test-backend: deps-backend ## Run backend tests
	go test ./pkg/...

test-backend-web: deps-backend ## Run backend tests using goconvey
	cd pkg && goconvey

test: test-frontend test-backend ## Run all tests


##@ Helpers

clean: ## Clean all artifacts
	rm -rf node_modules "$(JSONNET_VENDOR_DIR)" dist

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

#
# build grafana-pcp
#
YARN = yarn
JSONNET_PATH = ../grafonnet-lib
DASHBOARD_DIR := src/dashboards
DASHBOARDS := $(addprefix $(DASHBOARD_DIR)/,pcp-vector-host-overview.json pcp-vector-container-overview-cgroups1.json pcp-vector-container-overview-cgroups2.json pcp-vector-bcc-overview.json)

default: build

node_modules: package.json
	$(YARN) install
	sed -i 's@results.push(createIgnoreResult(filePath, cwd));@// &@' node_modules/eslint/lib/cli-engine/cli-engine.js

$(DASHBOARD_DIR)/%.json: $(DASHBOARD_DIR)/%.jsonnet
	jsonnet -J $(JSONNET_PATH) -o $@ $<

dist: node_modules $(DASHBOARDS)
	$(YARN) run build

build: dist

dev: node_modules $(DASHBOARDS)
	$(YARN) run dev

watch: $(DASHBOARDS)
	$(YARN) run watch

test: node_modules
	$(YARN) run test

clean:
	rm -rf node_modules dist

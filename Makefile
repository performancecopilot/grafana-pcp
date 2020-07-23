#
# build grafana-pcp
#
YARN = yarn
DASHBOARD_DIR := src/dashboards
JSONNET_DEPS := src/dashboard/jsonnetfile.json
DASHBOARDS := $(addprefix $(DASHBOARD_DIR)/,pcp-vector-host-overview.json pcp-vector-container-overview-cgroups1.json pcp-vector-container-overview-cgroups2.json pcp-vector-bcc-overview.json fulltext-graph-preview.json fulltext-table-preview.json)

default: build

node_modules: package.json
	$(YARN) install
	sed -i 's@results.push(createIgnoreResult(filePath, cwd));@// &@' node_modules/eslint/lib/cli-engine/cli-engine.js

$(JSONNET_DEPS):
	cd $(DASHBOARD_DIR) && jb install

$(DASHBOARD_DIR)/%.json: $(DASHBOARD_DIR)/%.jsonnet
	cd src/dashboards && jb install
	jsonnet -o $@ $<

dist: node_modules $(JSONNET_DEPS) $(DASHBOARDS)
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

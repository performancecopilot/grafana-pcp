#
# build grafana-pcp
#
YARN = yarn
JSONNET = jsonnet
JSONNETBUNDLER = jb

DASHBOARD_DIR := src/dashboards
DASHBOARDS_JSONNET = $(shell echo $(DASHBOARD_DIR)/*.jsonnet)
DASHBOARDS = $(DASHBOARDS_JSONNET:.jsonnet=.json)

default: build

node_modules: package.json
	$(YARN) install
	sed -i 's@results.push(createIgnoreResult(filePath, cwd));@// &@' node_modules/eslint/lib/cli-engine/cli-engine.js

vendor: jsonnetfile.json
	$(JSONNETBUNDLER) install

$(DASHBOARD_DIR)/%.json: $(DASHBOARD_DIR)/%.jsonnet
	$(JSONNET) -J vendor -o $@ $<

dist: node_modules vendor $(DASHBOARDS)
	$(YARN) run build

build: dist

dev: node_modules vendor $(DASHBOARDS)
	$(YARN) run dev

watch: node_modules vendor $(DASHBOARDS)
	$(YARN) run watch

test: node_modules
	$(YARN) run test

clean:
	rm -rf node_modules vendor dist

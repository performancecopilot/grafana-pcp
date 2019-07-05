#
# build grafana-pcp
#
YARN=/usr/bin/nodejs-yarn
SPEC=packaging/rpm/grafana-pcp.spec

default: node_modules dist/module.js.map

clean:
	rm -rf packaging/rpm/*.{rpm,tgz} node_modules

node_modules: package.json
	$(YARN) install

dist/module.js.map:
	$(YARN) run build
	@echo 'Note: all changes in "dist" directory must be committed. git status :'
	@git status

rpm: $(SPEC)
	packaging/rpm/make_rpms.sh

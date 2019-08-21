#
# build grafana-pcp
#
YARN=yarn

default: dist

node_modules: package.json
	$(YARN) install

dist: node_modules
	$(YARN) run build

.PHONY: clean
clean:
	rm -rf node_modules dist

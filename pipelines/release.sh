#!/bin/sh -eu
#
# Release process adapted from
# https://github.com/grafana/kentik-app/blob/master/.circleci/config.yml
#

PLUGIN_NAME="grafana-pcp"
VERSION=$(jq -r '.info.version' src/plugin.json)
RELEASE_NOTES=$(awk '/^## / {s++} s == 1 {print}' CHANGELOG.md)

yarn run build
git add --force dist/
git commit -m "release $VERSION"
git tag "v${VERSION}"
git push origin "v${VERSION}"
hub release create \
    -m "${PLUGIN_NAME} v${VERSION}" \
    -m "${RELEASE_NOTES}" \
    "v${VERSION}"

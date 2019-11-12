#!/bin/bash
#
# Release process adapted from
# https://github.com/grafana/kentik-app/blob/master/.circleci/config.yml
#
set -e

PLUGIN_NAME="grafana-pcp"
VERSION=$(cat src/plugin.json | jq '.info.version' | sed 's/"//g')
RELEASE_NOTES=$(awk '/^## / {s++} s == 1 {print}' CHANGELOG.md)

yarn run build
git add --force dist/
git commit -m "release $VERSION"
git tag -f v${VERSION}
git push -f origin v${VERSION}
hub release create \
    -m "${PLUGIN_NAME} v${VERSION}" \
    -m "${RELEASE_NOTES}" \
    v${VERSION}

#!/bin/bash
#
# Release process adapted from
# https://github.com/grafana/kentik-app/blob/master/.circleci/config.yml
#
set -e

if [[ ! "$(git rev-parse --abbrev-ref HEAD)" = "master" ]]; then
    echo "Releases can only be done from the master branch."
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo "Please commit or stash your uncommitted changes."
    exit 1
fi

PLUGIN_NAME="grafana-app"
VERSION=$(cat src/plugin.json | jq '.info.version' | sed 's/"//g')
RELEASE_NOTES=$(awk '/^## / {s++} s == 1 {print}' CHANGELOG.md)

git checkout -b release-${VERSION}
yarn run build
git add --force dist/
git commit -m "release $VERSION"
git push -f origin release-${VERSION}
git tag -f v${VERSION}
git push -f origin v${VERSION}
hub release create \
    -m "${PLUGIN_NAME} v${VERSION}" \
    -m "${RELEASE_NOTES}" \
    v${VERSION} \
git checkout master

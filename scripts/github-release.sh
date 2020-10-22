#!/bin/bash -eu
#
# Release process adapted from
# https://github.com/grafana/kentik-app/blob/master/.circleci/config.yml
#

VERSION=$(jq -r '.version' package.json)
RELEASE_NOTES=$(awk '/^## / {s++} s == 1 {print}' CHANGELOG.md)
PRERELEASE_ARG=""

if [[ "$VERSION" == *beta* ]]; then
  PRERELEASE_ARG="-p"
fi

# Grafana expects a dist directory in the commit specified by the Git tag
git add --force dist/
git commit -m "release $VERSION"
git tag "v${VERSION}"
git push origin "v${VERSION}"

hub release create \
    -m "grafana-pcp v${VERSION}" \
    -m "${RELEASE_NOTES}" \
    $PRERELEASE_ARG \
    "v${VERSION}"

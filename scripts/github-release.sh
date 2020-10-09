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

mv dist grafana-pcp
zip -q -r grafana-pcp.zip grafana-pcp

hub release create \
    -m "grafana-pcp v${VERSION}" \
    -m "${RELEASE_NOTES}" \
    -a grafana-pcp.zip \
    $PRERELEASE_ARG \
    "v${VERSION}"

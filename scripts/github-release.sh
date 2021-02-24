#!/bin/bash -eu
#
# Release process adapted from
# https://github.com/grafana/kentik-app/blob/master/.circleci/config.yml
# https://github.com/marcusolsson/grafana-jsonapi-datasource/blob/master/.github/workflows/main.yml
#

GRAFANA_PLUGIN_ID="$(jq -r '.id' dist/plugin.json)"
GRAFANA_PLUGIN_TYPE="$(jq -r '.type' dist/plugin.json)"
GRAFANA_PLUGIN_VERSION="$(jq -r '.info.version' dist/plugin.json)"
GRAFANA_PLUGIN_SHA="$(git rev-parse HEAD)"
GRAFANA_PLUGIN_ARTIFACT="${GRAFANA_PLUGIN_ID}-${GRAFANA_PLUGIN_VERSION}.zip"
GRAFANA_PLUGIN_ARTIFACT_CHECKSUM="${GRAFANA_PLUGIN_ARTIFACT}.md5"

RELEASE_NOTES=$(awk '/^## / {s++} s == 1 {print}' CHANGELOG.md)
PRERELEASE_ARG=""
if [[ "${GRAFANA_PLUGIN_VERSION}" == *beta* ]]; then
  PRERELEASE_ARG="-p"
fi

mv dist "${GRAFANA_PLUGIN_ID}"
zip "${GRAFANA_PLUGIN_ARTIFACT}" "${GRAFANA_PLUGIN_ID}" -r
md5sum "${GRAFANA_PLUGIN_ARTIFACT}" > "${GRAFANA_PLUGIN_ARTIFACT_CHECKSUM}"
GRAFANA_PLUGIN_CHECKSUM=$(cut -d' ' -f1 "${GRAFANA_PLUGIN_ARTIFACT_CHECKSUM}")

# grafana/plugin-validator
plugincheck "${GRAFANA_PLUGIN_ARTIFACT}"

hub release create \
    -m "grafana-pcp v${GRAFANA_PLUGIN_VERSION}" \
    -m "${RELEASE_NOTES}" \
    -a "${GRAFANA_PLUGIN_ARTIFACT}" \
    -a "${GRAFANA_PLUGIN_ARTIFACT_CHECKSUM}" \
    $PRERELEASE_ARG \
    "v${GRAFANA_PLUGIN_VERSION}"

echo Publish your plugin to grafana.com/plugins by opening a PR to https://github.com/grafana/grafana-plugin-repository with the following entry:
jq <<EOF
{
    "id": "${GRAFANA_PLUGIN_ID}",
    "type": "${GRAFANA_PLUGIN_TYPE}",
    "url": "https://github.com/${GITHUB_REPOSITORY}",
    "versions": [{
        "version": "${GRAFANA_PLUGIN_VERSION}",
        "commit": "${GRAFANA_PLUGIN_SHA}",
        "url": "https://github.com/${GITHUB_REPOSITORY}",
        "download": {
            "any": {
                "url": "https://github.com/${GITHUB_REPOSITORY}/releases/download/v${GRAFANA_PLUGIN_VERSION}/${GRAFANA_PLUGIN_ARTIFACT}",
                "md5": "${GRAFANA_PLUGIN_CHECKSUM}"
            }
        }
    }]
}
EOF

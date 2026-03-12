import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import grafanaConfig, { type Env } from './.config/webpack/webpack.config';

const PLUGIN_ID = 'performancecopilot-pcp-app';

const config = async (env: Env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);

  // The base config uses a VirtualModulesPlugin that sets __webpack_public_path__
  // dynamically at runtime based on the AMD module URI. For this multi-plugin setup
  // (app plugin with nested datasources), each datasource module sets the public path
  // to its own subdirectory, causing shared chunks (e.g. Monaco vendor files) to fail
  // loading. Replace it with a fixed public path pointing to the root app plugin.
  const basePlugins = (baseConfig.plugins ?? []).filter(
    (p) => !(p instanceof VirtualModulesPlugin)
  );

  return {
    ...baseConfig,
    output: {
      ...baseConfig.output,
      publicPath: `public/plugins/${PLUGIN_ID}/`,
    },
    plugins: [
      ...basePlugins,
      new VirtualModulesPlugin({
        'node_modules/grafana-public-path.js': `__webpack_public_path__ = 'public/plugins/${PLUGIN_ID}/';`,
      }),
      // Copy img/ directories for each datasource and panel.
      // These are referenced in plugin.json files but not imported in JS,
      // so they are not handled by webpack's asset/resource rule.
      new CopyWebpackPlugin({
        patterns: [
          { from: 'datasources/*/img/**', to: '.', noErrorOnMissing: true },
          { from: 'panels/*/img/**', to: '.', noErrorOnMissing: true },
        ],
      }),
      // Monaco editor workers required for bpftrace syntax highlighting and autocompletion.
      new MonacoWebpackPlugin({
        filename: 'monaco-[name].worker.js',
        languages: [],
        features: [
          '!accessibilityHelp',
          'bracketMatching',
          'caretOperations',
          '!clipboard',
          '!codeAction',
          '!codelens',
          '!colorDetector',
          '!comment',
          '!contextmenu',
          '!coreCommands',
          '!cursorUndo',
          '!dnd',
          '!find',
          'folding',
          '!fontZoom',
          '!format',
          '!gotoError',
          '!gotoLine',
          '!gotoSymbol',
          '!hover',
          '!iPadShowKeyboard',
          '!inPlaceReplace',
          '!inspectTokens',
          '!linesOperations',
          '!links',
          '!multicursor',
          'parameterHints',
          '!quickCommand',
          '!quickOutline',
          '!referenceSearch',
          '!rename',
          '!smartSelect',
          '!snippets',
          'suggest',
          '!toggleHighContrast',
          '!toggleTabFocusMode',
          '!transpose',
          '!wordHighlighter',
          '!wordOperations',
          '!wordPartOperations',
        ],
      }),
    ],
    optimization: {
      ...baseConfig.optimization,
      chunkIds: 'named',
      moduleIds: 'deterministic',
    },
  };
};

export default config;

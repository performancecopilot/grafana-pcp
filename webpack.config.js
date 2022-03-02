const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// monkey patch crypto module to not use deprecated md4 hash algorithm,
// which is removed in OpenSSL 3.0
// https://github.com/webpack/webpack/issues/13572#issuecomment-923736472
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

function updateForkTsCheckerPluginSettings(plugins) {
    for (const plugin of plugins) {
        if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') {
            plugin.async = false;
            return plugins;
        }
    }
    return plugins;
}

function fixEntrypoint(entry) {
    return {
        ...entry,
        // overwrite module entrypoint
        // workaround for https://github.com/grafana/grafana/issues/21785 / https://github.com/systemjs/systemjs/issues/2117
        module: ['@grafana/ui', entry.module],
    };
}

function enableReactMonacoEditor(externals) {
    return externals.filter(e => e !== "react-monaco-editor");
}

function excludeExtractionLoaderForMonaco(rules) {
    const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
    for (const rule of rules) {
        if (rule.test.toString() === /(dark|light)\.css$/.toString()) {
            rule.exclude = [...rule.exclude || [], MONACO_DIR];
        }
    }
    return rules;
}

function removeDataTestAttributeInProduction(production, rules) {
    if (!production)
        return rules;

    // somehow it doesn't work if this plugin is added to the existing babel-loader rule...
    return [
        ...rules,
        {
            test: /\.tsx?$/,
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { modules: false }]],
                        plugins: [
                            ['angularjs-annotate'],
                            ['remove-object-properties', { regexp: 'data-test' }]
                        ],
                        sourceMaps: true,
                    },
                },
                {
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true,
                        transpileOnly: true,
                    },
                },
            ],
            exclude: /(node_modules)/,
        }
    ];
}

module.exports.getWebpackConfig = (config, options) => {
    return {
        ...config,
        externals: enableReactMonacoEditor(config.externals),
        entry: fixEntrypoint(config.entry),
        output: {
            ...config.output,
            // required for dynamic imports
            publicPath: 'public/plugins/performancecopilot-pcp-app/',
        },
        module: {
            ...config.module,
            rules: removeDataTestAttributeInProduction(options.production, excludeExtractionLoaderForMonaco(config.module.rules)),
        },
        plugins: [
            ...updateForkTsCheckerPluginSettings(config.plugins),
            new MonacoWebpackPlugin({
                filename: 'monaco-[name].worker.js',
                languages: [],
                features: [ // enable same features as https://github.com/grafana/grafana/blob/master/scripts/webpack/webpack.common.js
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
            ...config.optimization,
            chunkIds: 'named', // required for dynamic imports in production build
        }
    };
};

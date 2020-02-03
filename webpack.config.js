const path = require('path');
const webpack = require('webpack');
const { ConcatSource } = require("webpack-sources");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

class GrafanaScriptedDashboardPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const footerText = "return function(callback) { new Dashboard().getDashboard().then(callback); };"

        compiler.hooks.compilation.tap("GrafanaScriptedDashboardPlugin", compilation => {
            compilation.hooks.optimizeChunkAssets.tap("GrafanaScriptedDashboardPlugin", chunks => {
                for (const chunk of chunks) {
                    for (const file of chunk.files) {
                        compilation.assets[file] = new ConcatSource(compilation.assets[file], "\n", footerText);
                    }
                }
            });
        });
    }
}

const baseConfig = {
    node: {
        fs: 'empty'
    },
    context: path.join(__dirname, 'src'),
    devtool: 'source-map',
    externals: [
        'lodash',
        'react',
        '@grafana/ui',
        '@grafana/data',
        function (context, request, callback) {
            var prefix = 'grafana/';
            if (request.indexOf(prefix) === 0) {
                return callback(null, request.substr(prefix.length));
            }
            callback();
        }
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loaders: [
                {
                    loader: 'babel-loader',
                },
                'ts-loader'
            ],
            exclude: /(node_modules)/,
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        sourceMap: true
                    }
                },
            ]
        }],
        noParse: [
            // Suppress warnings and errors logged by benchmark.js when bundled using webpack.
            // https://github.com/bestiejs/benchmark.js/issues/106
            path.resolve(__dirname, './node_modules/benchmark/benchmark.js')
        ]
    }
};

module.exports = [{
    ...baseConfig,
    entry: {
        './module': './module.ts',
        './datasources/redis/module': './datasources/redis/module.ts',
        './datasources/vector/module': './datasources/vector/module.ts',
        './datasources/bpftrace/module': './datasources/bpftrace/module.ts',
        './panels/flamegraph/module': './panels/flamegraph/module.tsx'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'amd'
    },
    plugins: [
        new CleanWebpackPlugin('dist', { allowExternal: true }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new CopyWebpackPlugin([
            { from: '../README.md', to: '.' },
            { from: '../LICENSE', to: '.' },
            { from: '../NOTICE', to: '.' },
            { from: '**/*.md', to: '.' },
            { from: '**/plugin.json', to: '.' },
            { from: '**/*.html', to: '.' },
            { from: '**/img/*', to: '.' },
            { from: '**/css/*', to: '.' },
            { from: 'dashboards/*', to: '.' },
        ]),
    ]
}, {
    ...baseConfig,
    entry: {
        './dashboards/checklist': './dashboards/checklist/module.ts'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'this'
    },
    plugins: [
        new GrafanaScriptedDashboardPlugin(),
    ]
}];

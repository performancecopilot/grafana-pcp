const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  node: {
    fs: 'empty'
  },
  context: path.join(__dirname, 'src'),
  entry: {
    'module': './module.ts',
    './datasources/redis/module': './datasources/redis/module.ts',
    './datasources/live/module': './datasources/live/module.ts',
    './datasources/bpftrace/module': './datasources/bpftrace/module.ts'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'amd'
  },
  externals: [
    'lodash',
    function (context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new CleanWebpackPlugin('dist', {allowExternal: true}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      {from: '../README.md', to: '.'},
      {from: '../LICENSE', to: '.'},
      {from: '../NOTICE', to: '.'},
      {from: '**/*.md', to: '.'},
      {from: '**/plugin.json', to: '.'},
      {from: '**/*.html', to: '.'},
      {from: '**/img/*', to: '.'},
      {from: '**/css/*', to: '.'},
    ]),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
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
      }
    ]
  }
};

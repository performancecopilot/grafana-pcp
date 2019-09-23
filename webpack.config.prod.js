const baseWebpackConfig = require('./webpack.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var conf = baseWebpackConfig;
conf.mode = 'production';

//conf.plugins.push(new ngAnnotatePlugin());
// conf.plugins.push(
//   new UglifyJSPlugin({
//     sourceMap: true,
//   })
// );

module.exports = conf;

const baseWebpackConfig = require('./webpack.config');

var conf = baseWebpackConfig;
conf.mode = 'production';

module.exports = conf;

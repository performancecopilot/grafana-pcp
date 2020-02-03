const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.config');

var productionConfig = baseConfig;
productionConfig.forEach(config => {
    config.mode = 'production';
    config.optimization = {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        bare_returns: true
                    }
                }
            }),
        ],
    };
})

module.exports = productionConfig;

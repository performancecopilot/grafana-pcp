module.exports.getWebpackConfig = (config, options) => ({
    ...config,
    module: {
        ...config.module,
        rules: [
            // worker-loader need to be processed before ts-loader
            {

                test: /\.worker\.ts$/,
                loader: 'worker-loader',
                options: { publicPath: 'public/plugins/performancecopilot-pcp-app/' }
            },
            ...config.module.rules,
        ]
    }
});

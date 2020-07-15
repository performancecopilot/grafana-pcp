function updateForkTsCheckerPluginSettings(plugins) {
    for (const plugin of plugins) {
        if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') {
            plugin.async = false;
        }
    }
    return plugins;
}

module.exports.getWebpackConfig = (config, options) => ({
    ...config,
    entry: {
        ...config.entry,
        // workaround for https://github.com/grafana/grafana/issues/21785 / https://github.com/systemjs/systemjs/issues/2117
        module: ['@grafana/ui', config.entry.module],
    },
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
    },
    plugins: updateForkTsCheckerPluginSettings(config.plugins)
});

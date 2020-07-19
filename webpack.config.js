function updateForkTsCheckerPluginSettings(plugins) {
    for (const plugin of plugins) {
        if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') {
            plugin.async = false;
        }
    }
    return plugins;
}

module.exports.getWebpackConfig = (config, options) => {
    // removes all 'data-test' attributes from React components - only 'remove-object-properties' worked, so if any lib need 'data-test', bad luck :S
    const { production } = options;
    let patchedBabelRules = [];
    if (options.production) {
        const rulesWithBabelLoader = config.module.rules.filter(x => {
            if (x.loaders) {
                return x.loaders.some(loader => loader.loader === 'babel-loader');
            }
            return false;
        });
        patchedBabelRules = rulesWithBabelLoader.map(rule => ({
            ...rule,
            loaders: rule.loaders.map(loader => ({
                ...loader,
                options: {
                    ...loader.options,
                    ...(loader.options.plugins
                        ? {
                              plugins: [
                                  ...loader.options.plugins,
                                  ['remove-object-properties', { regexp: 'data-test' }],
                              ],
                          }
                        : {}),
                },
            })),
        }));
    }
    return {
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
                    options: { publicPath: 'public/plugins/performancecopilot-pcp-app/' },
                },
                ...config.module.rules,
                ...patchedBabelRules,
            ],
        },
        plugins: updateForkTsCheckerPluginSettings(config.plugins),
    };
};

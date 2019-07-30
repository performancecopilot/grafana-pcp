module.exports = {
    verbose: true,
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.jest.json",
            babelConfig: true,
            isolatedModules: true
        },
    },
    moduleNameMapper: {
        "app/plugins/sdk": "<rootDir>/node_modules/grafana-sdk-mocks/app/plugins/sdk.ts",
        "grafana/app/core/utils/kbn": "<rootDir>/src/datasources/lib/__mocks__/kbn.ts",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(grafana-sdk-mocks))",
    ],
    setupFiles: [
        "jest-date-mock"
    ],
    testRegex: "(\\.|/)i?test\\.ts$",
    moduleFileExtensions: [
        "js",
        "json",
        "jsx",
        "ts",
        "tsx",
    ],
    preset: "ts-jest",
};

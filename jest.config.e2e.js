const standard = require('@grafana/toolkit/src/config/jest.plugin.config');
const defaultConfig = standard.jestConfig();

module.exports = {
    ...defaultConfig,
    setupFiles: ['jest-canvas-mock'],
    preset: 'jest-puppeteer',
    testMatch: [
        '<rootDir>/e2e/**/*.{ts,tsx}',
    ],
};

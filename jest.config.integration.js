var config = require('./jest.config');
module.exports = {
    ...config,
    testRegex: "(\\.|/)itest\\.ts$",
}

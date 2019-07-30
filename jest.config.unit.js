var config = require('./jest.config');
module.exports = {
    ...config,
    testRegex: "(\\.|/)test\\.ts$",
}

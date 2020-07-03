
const Config = require('../../src/lib/config')
const finalConfig = new Config('./fixtures/_gatsby.config').toConfig().plugins

module.exports = finalConfig

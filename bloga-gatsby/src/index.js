const Config = require('./lib/config')
const {getGatsbyOptions} = require('./lib/plugin-options')
const oclif = require('@oclif/command')
module.exports = {
  ...oclif,
  Config,
  getGatsbyOptions,
}

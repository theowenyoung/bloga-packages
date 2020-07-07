const {Command, flags} = require('@oclif/command')
const yaml = require('js-yaml')

const {getGatsbyOptions, loadGatsbyOptions} = require('../lib/options')

class OptionsCommand extends Command {
  async run() {
    const {flags} = this.parse(OptionsCommand)
    const override = flags.override
    if (override) {
      await loadGatsbyOptions({path: flags.path, format: flags.format})
    } else {
      const options = await getGatsbyOptions({
      })
      if (flags.format === 'json') {
      // eslint-disable-next-line no-console
        console.log(JSON.stringify(options, null, 2))
      } else {
        // eslint-disable-next-line no-console
        console.log(yaml.safeDump(options))
      }
    }
  }
}

OptionsCommand.description = 'Generate bloga options'

OptionsCommand.flags = {
  override: flags.boolean({char: 'o', default: false, description: 'is override bloga-options.yaml?'}),
  path: flags.string({
    char: 'p', description: 'file path',
  }),
  format: flags.string({
    char: 'f', description: 'output format, yaml or json', default: 'yaml',
  }),
}

module.exports = OptionsCommand

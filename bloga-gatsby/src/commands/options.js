const {Command, flags} = require('@oclif/command')

const {getGatsbyOptions, loadGatsbyOptions} = require('../lib/options')

class OptionsCommand extends Command {
  async run() {
    const {flags} = this.parse(OptionsCommand)
    const override = flags.override
    if (override) {
      await loadGatsbyOptions({path: flags.path})
    } else {
      const options = await getGatsbyOptions()
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(options, null, 2))
    }
  }
}

OptionsCommand.description = 'Generate bloga options'

OptionsCommand.flags = {
  override: flags.boolean({char: 'o', default: false, description: 'is override bloga-options.yaml?'}),
  path: flags.string({
    char: 'p', description: 'file path', default: 'bloga-options.yaml',
  }),
}

module.exports = OptionsCommand

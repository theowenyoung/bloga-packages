require('dotenv').config()

const {Command, flags} = require('@oclif/command')
const {loadSiteConfig} = require('bloga-core')
const {BLOGA_SITE_CONFIG_PATH} = require('../constans')
class InitCommand extends Command {
  async run() {
    const {flags} = this.parse(InitCommand)
    const file = flags.file
    const options = {
      path: BLOGA_SITE_CONFIG_PATH,
    }

    if (file) {
      options.file = file
    }
    if (flags['path-prefix'] !== undefined) {
      options.pathPrefix = flags['path-prefix']
    }
    this.log('init remote settings file start')
    await loadSiteConfig(options)
    this.log(`load bloga site config success, the config location is at ${BLOGA_SITE_CONFIG_PATH}`)
  }
}

InitCommand.description = `Describe the command here
...
Extra documentation goes here
`

InitCommand.flags = {
  // eslint-disable-next-line no-template-curly-in-string
  file: flags.string({char: 'f', description: 'remote file url'}),
  'path-prefix': flags.string({char: 'p', description: 'path prefix'}),
}

module.exports = InitCommand

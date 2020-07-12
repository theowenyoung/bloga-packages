const {Command, flags} = require('@oclif/command')
const path = require('path')
const {loadBlogaWorkflows} = require('../lib/workflows')

class WorkflowsCommand extends Command {
  async run() {
    const {flags} = this.parse(WorkflowsCommand)
    const template = flags.template
    this.log(`Start to clone from ${template}`)
    await loadBlogaWorkflows({template: template, path: flags.path})
    this.log('done.')
  }
}

WorkflowsCommand.description = 'Generate bloga github workflows'

WorkflowsCommand.flags = {
  template: flags.string({
    char: 't', description: 'workflow template repo', default: 'https://github.com/theowenyoung/gatsby-starter-blog',
    path: flags.string({
      char: 'p', description: 'file path', default: path.resolve(process.cwd(), '.github/workflows'),
    }),
  }),

}

module.exports = WorkflowsCommand

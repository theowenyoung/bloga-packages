const Case = require('case')
const getSupportedPlugins = require('./plugin-options')
const path = require('path')
const {getConfigFile} = require('gatsby/dist/bootstrap/get-config-file')
const yaml = require('js-yaml')
const fs = require('fs-extra')
const debug = require('debug')('bloga-gatsby:options')
const getSiteMetadataOptions = config => {
  const option = {
    type: 'object',
    name: 'siteMetadata',
    label: ' Site Metadata',
    options: [],
  }
  if (config.siteMetadata) {
    const keys = Object.keys(config.siteMetadata)
    keys.forEach(key => {
      const value = config.siteMetadata[key]
      option.options.push({
        type: typeof value,
        default: value,
        name: key,
        label: Case.title(key),
      })
    })
  }
  return option
}
const getSourcesOptions = (pkg = {}) => {
  const supportSourcePlugins = {
    '@theowenyoung/gatsby-source-twitter': 'twitter',
    '@theowenyoung/gatsby-source-git': 'git',
  }
  const dependences = []
  if (pkg.dependencies) {
    const keys = Object.keys(pkg.dependencies)
    keys.forEach(key => {
      if (supportSourcePlugins[key]) {
        dependences.push({
          plugin: key,
          version: pkg.dependencies[key],
          provider: supportSourcePlugins[key],
        })
      }
    })
  }
  if (pkg.devDependencies) {
    const keys = Object.keys(pkg.devDependencies)
    keys.forEach(key => {
      if (supportSourcePlugins[key]) {
        dependences.push({
          provider: supportSourcePlugins[key],
          plugin: key,
          version: pkg.devDependencies[key],
        })
      }
    })
  }
  return dependences.map(item => {
    return {
      provider: item.provider,
    }
  })
}
const getPluginsOptions = async (config = {}) => {
  const plugins = config.plugins
  const supportedPlugins = await getSupportedPlugins()
  const currentPluginsMap = {}
  plugins.forEach(plugin => {
    currentPluginsMap[plugin.resolve] = plugin
  })
  const options = []
  plugins.forEach(plugin => {
    const resolve = plugin.resolve
    if (supportedPlugins[resolve]) {
      let pluginOptions = supportedPlugins[resolve].options
      if (currentPluginsMap[resolve].options) {
        pluginOptions = pluginOptions.map(pluginOption => {
          if (currentPluginsMap[resolve].options[pluginOption.name]) {
            pluginOption.default = currentPluginsMap[resolve].options[pluginOption.name]
          }
          return pluginOption
        })
      }
      options.push({
        type: 'plugin-options',
        plugin: resolve,
        label: Case.title(resolve),
        options: pluginOptions,

      })
    }
  })
  return options
}

const getGatsbyOptions = async ({pwd} = {}) => {
  if (!pwd) {
    pwd = process.cwd()
  }
  debug('pwd: %s', pwd)
  const pkg = require(path.resolve(pwd, 'package.json'))
  let blogaOptions = {}
  let optionsContent = ''
  try {
    optionsContent = await fs.readFile(path.resolve(pwd, 'bloga-options.yaml'), 'utf8')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.info('can not detect bloga options config, it\'ll detect options automatically')
  }
  try {
    blogaOptions = yaml.safeLoad(optionsContent)
  } catch (error) {
    throw error
  }
  // if(!blogaOptions){
  //   blogaOptions = {}
  // }

  const {configModule: config} = await getConfigFile(
    pwd,
    'gatsby-config'
  )
  const finalOptions = {}
  finalOptions.options = []
  if (blogaOptions.sources) {
    finalOptions.sources  = blogaOptions.sources
  } else {
    finalOptions.sources = (getSourcesOptions(pkg))
  }
  // detect is include siteMetadataOptions
  const blogaOptionsConfig = blogaOptions.options || []
  const blogaOptionsSiteMetadataOption = blogaOptionsConfig.filter(option => option.name === 'siteMetadata')

  if (blogaOptionsSiteMetadataOption.length > 0) {
    const siteMetaOption = getSiteMetadataOptions(config)
    const finalSiteMetaOptionOptions = []
    siteMetaOption.options.forEach(option => {
      const blogaSiteMetadataOptions = blogaOptionsSiteMetadataOption[0].options || []
      const sameOption = blogaSiteMetadataOptions.filter(item => item.name === option.name)
      const isExistOption = sameOption.length > 0
      if (isExistOption) {
        finalSiteMetaOptionOptions.push(sameOption[0])
      } else {
        finalSiteMetaOptionOptions.push(option)
      }
    })
    siteMetaOption.options = finalSiteMetaOptionOptions
    finalOptions.options.push(siteMetaOption)
  } else {
    finalOptions.options.push(getSiteMetadataOptions(config))
  }

  const pluginOptions = await getPluginsOptions(config)
  const finalPluginOptions = blogaOptionsConfig.filter(option => option.type === 'plugin-options')
  const dotUsePluginOptions = []

  pluginOptions.forEach(option => {
    const blogaOptionsPluginOption = blogaOptionsConfig.filter(blogaOption => blogaOption.type === 'plugin-options' && blogaOption.name === option.name)
    if (blogaOptionsPluginOption.length > 0) {
      if (!dotUsePluginOptions.includes(blogaOptionsPluginOption[0].name)) {
        dotUsePluginOptions.push(blogaOptionsPluginOption[0].name)
      }
    }
  })

  pluginOptions.forEach(option => {
    if (!dotUsePluginOptions.includes(option.name)) {
      finalPluginOptions.push(option)
    }
  })

  finalOptions.options = finalOptions.options.concat(finalPluginOptions)
  return finalOptions
}
const loadGatsbyOptions = async ({pwd, path: filePath, format = 'yaml'} = {}) => {
  const options =  await getGatsbyOptions({pwd})
  debug('pwd: %s, path: %s, format: %s', pwd, filePath, format)
  let output = ''
  if (format === 'json') {
    output = JSON.stringify(options, null, 2)
  } else  {
    output = yaml.safeDump(options)
  }
  if (filePath) {
    // do nothing
  } else if (format === 'json') {
    filePath = 'bloga-options.json'
  } else {
    filePath = 'bloga-options.yaml'
  }
  await fs.outputFile(filePath, output)
  return output
}
module.exports = {
  getGatsbyOptions,
  loadGatsbyOptions,
}

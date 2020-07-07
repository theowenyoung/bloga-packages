const path = require('path')
const debugFn = require('debug')
const {BLOGA_SITE_CONFIG_PATH} = require('../constans')
const {getResolveByProvider, getPluginOptions, getTemplateValue} = require('./util')
const debug = debugFn('bloga-gatsby')
const mapObject = require('map-obj')

class Config {
  constructor(gatsbyConfigPath, options = {}) {
    this.originGatsbyConfig = require(path.resolve(gatsbyConfigPath))
    this.options = options
    this.gatsbyConfig = this.originGatsbyConfig
    this._init()
  }

  _initBlogaSiteConfig() {
    try {
      const blogaSiteConfig = require(path.resolve(BLOGA_SITE_CONFIG_PATH))

      this.blogaSiteConfig = blogaSiteConfig
      this.blogaSiteConfig.sources = this.blogaSiteConfig.sources || []
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Can not detect bloga site config, have you init bloga site config first?')
      this.blogaSiteConfig = {
        sources: [],
      }
    }
  }

  _initSitePathPrefix() {
    const blogaSiteConfig = this.blogaSiteConfig
    if (blogaSiteConfig.pathPrefix) {
      this.gatsbyConfig.pathPrefix = blogaSiteConfig.pathPrefix
      // Make sure pathPrefix is empty if not needed
      if (this.gatsbyConfig.pathPrefix === '/') {
        delete this.gatsbyConfig.pathPrefix
      } else {
        // Make sure pathPrefix only contains the first forward slash
        this.gatsbyConfig.pathPrefix = `/${this.gatsbyConfig.pathPrefix.replace(/^\/|\/$/g, '')}`
      }
    }
  }

  _mergeSiteMetadata() {
    const blogaSiteConfig = this.blogaSiteConfig
    if (blogaSiteConfig.siteMetadata) {
      this.gatsbyConfig.siteMetadata = {
        ...this.gatsbyConfig.siteMetadata,
        ...blogaSiteConfig.siteMetadata,
      }
    }
  }

  _mergePluginOptions() {
    const blogaSiteConfig = this.blogaSiteConfig
    const gatsbyConfig = this.gatsbyConfig
    if (blogaSiteConfig.plugins) {
      const gatsbyConfigPluginsIndexMap = {}
      const gatsbyConfigPluginsIndexArr = gatsbyConfig.plugins.map(plugin => {
        if (typeof gatsbyConfigPluginsIndexMap[plugin.resolve] === 'undefined') {
          gatsbyConfigPluginsIndexMap[plugin.resolve] = 0
        } else {
          gatsbyConfigPluginsIndexMap[plugin.resolve] += 1
        }

        return {
          index: gatsbyConfigPluginsIndexMap[plugin.resolve],
        }
      })
      gatsbyConfig.plugins.forEach((plugin, index) => {
        if (blogaSiteConfig.plugins[plugin.resolve]) {
          let blogaPluginOptions = blogaSiteConfig.plugins[plugin.resolve]
          if (Array.isArray(blogaPluginOptions)) {
            // multiple
            const currentPluginIndex = gatsbyConfigPluginsIndexArr[index].index
            blogaPluginOptions = blogaPluginOptions[currentPluginIndex] || {}
          }
          // bloga site config plugin detect
          plugin.options = {
            ...plugin.options,
            ...blogaPluginOptions,
          }
        }
      })
    }
  }

  _initSourcesPlugins() {
    // get package.json plugin

    const allPackagePlugins = Object.keys(this.packageJson.dependencies).concat(Object.keys(this.packageJson.devDependencies))
    const allBlogaSourcePlugins = this.blogaSiteConfig.sources.map(source => {
      return getResolveByProvider(source)
    }).filter(sourcePlugin => {
      return sourcePlugin
    })
    const allBlogaSources = this.blogaSiteConfig.sources.filter(source => {
      return getResolveByProvider(source)
    })
    // allow sourcePlugins
    const allowSourcesPlugins =  [...new Set(allPackagePlugins.filter(x => new Set(allBlogaSourcePlugins).has(x)))]
    debug('allowSourcesPlugins: %o', allowSourcesPlugins)

    const originGatsbySourcePluginsMap = {}

    this.gatsbyConfig.plugins.forEach((plugin, index) => {
      if (allowSourcesPlugins.includes(plugin.resolve)) {
        plugin._index = index
        if (originGatsbySourcePluginsMap[plugin.resolve]) {
          originGatsbySourcePluginsMap[plugin.resolve].push(plugin)
        } else {
          originGatsbySourcePluginsMap[plugin.resolve] = [plugin]
        }
      }
    })
    // console.log('this.gatsbyConfig.plugins', this.gatsbyConfig.plugins)

    // console.log('originGatsbySourcePluginsMap', originGatsbySourcePluginsMap)
    // delete origin plugin
    Object.keys(originGatsbySourcePluginsMap).forEach(sourceKey => {
      const sourceArr = originGatsbySourcePluginsMap[sourceKey]
      sourceArr.forEach(sourcePlugin => {
        delete this.gatsbyConfig.plugins[sourcePlugin._index]
      })
    })
    this.gatsbyConfig.plugins = this.gatsbyConfig.plugins.filter(item => item)

    // source
    // get gatsby source plugin config
    const allowSourcesPluginIndexMap = {}
    allBlogaSources.forEach(source => {
      let pluginResolve = getResolveByProvider(source)
      if (pluginResolve) {
        if (allowSourcesPluginIndexMap[pluginResolve] === undefined) {
          allowSourcesPluginIndexMap[pluginResolve] = 0
        } else {
          allowSourcesPluginIndexMap[pluginResolve] += 1
        }
        let originOptions = {}
        if (originGatsbySourcePluginsMap[pluginResolve]) {
          if (originGatsbySourcePluginsMap[pluginResolve][allowSourcesPluginIndexMap[pluginResolve]]) {
            originOptions = originGatsbySourcePluginsMap[pluginResolve][allowSourcesPluginIndexMap[pluginResolve]].options
          } else {
            originOptions = originGatsbySourcePluginsMap[pluginResolve][0].options
          }
        }

        this.gatsbyConfig.plugins.unshift({
          resolve: pluginResolve,
          options: getPluginOptions(source, originOptions),
        })
      }
    })
    // add source
    // delete origin sources plugins
    // add new merged source plugin
  }

  _initPackageJson() {
    try {
      const packageJson = require(path.resolve('package.json'))
      this.packageJson = packageJson
      this.packageJson.dependencies = this.packageJson.dependencies || {}
      this.packageJson.devDependencies = this.packageJson.devDependencies || {}
    } catch (error) {
      throw error
    }
  }

  _init() {
    this._initPackageJson()
    this.gatsbyConfig.plugins = this.gatsbyConfig.plugins.map(plugin => {
      plugin = typeof plugin === 'string' ? {resolve: plugin} : plugin
      return plugin
    })
    this._initBlogaSiteConfig()
    this._initSitePathPrefix()
    this._initSourcesPlugins()
    this._mergeSiteMetadata()
    this._mergePluginOptions()
    this._formatConfig()
  }

  _formatConfig() {
    this.gatsbyConfig = mapObject(this.gatsbyConfig, (key, value) => {
      if (typeof value === 'string') {
        value = getTemplateValue(value, {
          env: process.env,
          date: {
            year: new Date().getFullYear(),
          },
          config: this.gatsbyConfig,
        })
      }
      return [key, value]
    }, {
      deep: true,
    })
  }

  toConfig() {
    return this.gatsbyConfig
  }
}

module.exports = Config

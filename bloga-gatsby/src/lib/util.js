/* eslint-disable camelcase */
const _ = require('lodash')
const sourceMap = {
  twitter: '@theowenyoung/gatsby-source-twitter',
  git: '@theowenyoung/gatsby-source-git',
  instagram: '@theowenyoung/gatsby-source-instagram',
}
const getResolveByProvider = function (source) {
  const {provider} = source
  if (sourceMap[provider]) {
    return sourceMap[provider]
  }
  return ''
}
const getPluginOptions = function (source, originOptions = {}) {
  const {credentials, options, provider, event} = source

  if (sourceMap[provider]) {
    const plugin = {
      resolve: sourceMap[provider],
      options: {},
    }
    if (provider === 'twitter') {
      // const twitterOptions = {
      //   credentials: source.credentials,
      //   queries: {
      //     tweets: {
      //       endpoint: 'statuses/user_timeline',
      //       maxCount: db.get(buildConfig.buildCacheKey).value() ? 200 : 3200,
      //       params: {include_rts: true,
      //         count: 200,
      //         exclude_replies: true,
      //         tweet_mode: 'extended', ...rest},
      //     },

      //   },
      // }
      if (credentials) {
        plugin.options.credentials = {
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          rest_base: credentials.api,
        }
      }
      let originTweetsOptions = {}
      let originTweetsParam = {}
      if (originOptions.queries && originOptions.queries.tweets) {
        originTweetsOptions = originOptions.queries.tweets
        if (originOptions.queries.tweets.params) {
          originTweetsParam = originOptions.queries.tweets.params
        }
      }
      plugin.options.queries = {
        tweets: {
          ...originTweetsOptions,
          endpoint: event,
          params: {
            ...originTweetsParam,
            ...options,
          },
        },
      }
    } else if (provider === 'instagram') {
      plugin.options = {
        ...originOptions,
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        connection_id: credentials.connection_id,
        instagram_id: options.user_id,
      }
    } else {
      plugin.options = {
        ...source.options,
      }
      if (source.credentials) {
        plugin.options.credentials = source.credentials
      }
    }

    return plugin.options
  }
  return null
}

const getTemplateValue = function (text, ctx) {
  _.templateSettings.interpolate = /\${{([\s\S]+?)}}/g
  const compiled = _.template(text)
  return compiled(ctx)
}
exports.getResolveByProvider = getResolveByProvider
exports.getPluginOptions = getPluginOptions
exports.getTemplateValue = getTemplateValue


module.exports = async function () {
  const supportedPlugins = {
    'gatsby-plugin-google-analytics': {
      options: [
        {
          type: 'string',
          name: 'trackingId',
          label: 'Tracking Id',
        },
      ],
    },
  }
  return supportedPlugins
}

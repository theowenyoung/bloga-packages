const {fetch} = require('./fetch');
const fs = require('fs-extra')

const getSiteConfig = async function(options={}){
  const siteSettingsUrl = process.env.BLOGA_SITE_CONFIG_URL || options.url;
  if(!siteSettingsUrl){
    console.log('siteSettingsUrl',siteSettingsUrl);
    
    throw new Error('Can not detect site settings url, please set an enviroments var BLOGA_SITE_CONFIG_URL or pass it through options.url')
  }
  return await fetch(siteSettingsUrl).then(data=>{
    if(options.pathPrefix!==undefined){
      if(options.pathPrefix==="/" || options.pathPrefix===""){
         delete data.pathPrefix;
      }else{
        data.pathPrefix = options.pathPrefix
      }
   }
   return data
  })
}

const loadSiteConfig = async function(options={}){
  if(!options.path){
    throw new Error(`Miss param path`)
  }
  let config = {}
  try {
     config = await getSiteConfig(options)     
  } catch (error) {    
    console.warn(error.message)
  }

  await fs.outputJson(options.path, config)
  return config
}


exports.getSiteConfig = getSiteConfig
exports.loadSiteConfig = loadSiteConfig
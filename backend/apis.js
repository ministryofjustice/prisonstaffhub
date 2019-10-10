const config = require('./config')
const clientFactory = require('./api/oauthEnabledClient')
const { elite2ApiFactory } = require('./api/elite2Api')
const { oauthApiFactory } = require('./api/oauthApi')
const { whereaboutsApiFactory } = require('./api/whereaboutsApi')
const { communityApiFactory } = require('./api/communityApi')

const elite2Api = elite2ApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: config.apis.elite2.timeoutSeconds * 1000,
  })
)

const whereaboutsApi = whereaboutsApiFactory(
  clientFactory({
    baseUrl: config.apis.whereabouts.url,
    timeout: config.apis.whereabouts.timeoutSeconds * 1000,
  })
)

const communityApi = communityApiFactory(
  clientFactory({
    baseUrl: config.apis.community.url,
    timeout: config.apis.community.timeoutSeconds * 1000,
  })
)

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: config.apis.oauth2.timeoutSeconds * 1000,
  }),
  { ...config.apis.oauth2 }
)

module.exports = {
  elite2Api,
  whereaboutsApi,
  oauthApi,
  communityApi,
}

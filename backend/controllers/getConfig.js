const asyncMiddleware = require('../middleware/asyncHandler')
const config = require('../config')

const getConfiguration = asyncMiddleware(async (req, res) =>
  res.json({
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
    licencesUrl: config.app.licencesUrl,
    flags: config.app.featureFlags,
    supportUrl: config.app.supportUrl,
    authUrl: config.apis.oauth2.url,
  })
)

module.exports = {
  getConfiguration,
}

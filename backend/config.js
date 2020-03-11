module.exports = {
  app: {
    port: process.env.PORT || 3002,
    production: process.env.NODE_ENV === 'production',
    notmEndpointUrl: process.env.NN_ENDPOINT_URL || 'http://localhost:3000/',
    licencesUrl: process.env.LICENCES_URL || 'http://localhost:3003/',
    mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
    tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
    url: process.env.PRISON_STAFF_HUB_UI_URL || `http://localhost:${process.env.PORT || 3002}/`,
    maximumFileUploadSizeInMb: process.env.MAXIMUM_FILE_UPLOAD_SIZE_IN_MB || 200,
    featureFlags: {},
    videoLinkEnabledFor: process.env.VIDEO_LINK_ENABLED_FOR || '',
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  },
  hmppsCookie: {
    name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
    domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
    expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 60,
    sessionSecret: process.env.SESSION_COOKIE_SECRET || 'notm-insecure-session',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  apis: {
    oauth2: {
      url: process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
      ui_url: process.env.OAUTH_ENDPOINT_UI_URL || process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
      timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 10,
      clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
      clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
      systemClientId: process.env.API_SYSTEM_CLIENT_ID || 'prisonstaffhubclient',
      systemClientSecret: process.env.API_SYSTEM_CLIENT_SECRET || 'clientsecret',
    },
    elite2: {
      url: process.env.API_ENDPOINT_URL || 'http://localhost:8080/',
      timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30,
    },
    whereabouts: {
      url: process.env.API_WHEREABOUTS_ENDPOINT_URL || 'http://localhost:8082/',
      timeoutSeconds: process.env.API_WHEREABOUTS_ENDPOINT_TIMEOUT_SECONDS || 30,
    },
    community: {
      url: process.env.API_COMMUNITY_ENDPOINT_URL || 'http://localhost:8083/communityapi',
      timeoutSeconds: process.env.API_COMMUNITY_ENDPOINT_TIMEOUT_SECONDS || 30,
      apiPrefix: process.env.API_COMMUNITY_API_PREFIX || '/api',
    },
  },
  notifications: {
    notifyKey: process.env.NOTIFY_API_KEY || '',
    confirmBookingPrisonTemplateId: '391bb0e0-89b3-4aef-b11e-c6550b71fee8',
    confirmBookingCourtTemplateId: '7f44cd94-4a74-4b9d-aff8-386fec34bd2e',
    requestBookingCourtTemplateId: 'c1008f55-c228-4cad-b6fd-fe931c993855',
    emails: {
      WWI: {
        omu: 'OMU.wandsworth@justice.gov.uk',
        vlb: 'VVCWandsworth@justice.gov.uk',
      },
    },
  },
}

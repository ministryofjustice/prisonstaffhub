const COOKIE_NAME = 'ui-notification-bar'
const notificationKey = ({ id, revision }) => `${id}-${revision}`

const markAsDismissed = (res, { id, revision }) => {
  const oneYear = 52 * 24 * 3600000
  return res.cookie(COOKIE_NAME, notificationKey({ id, revision }), { maxAge: oneYear, httpOnly: true })
}

const alreadyDismissed = (req, { id, revision }) => req.cookies[COOKIE_NAME] === notificationKey({ id, revision })

module.exports = {
  markAsDismissed,
  alreadyDismissed,
}

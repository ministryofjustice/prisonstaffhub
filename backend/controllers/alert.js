const moment = require('moment')
const { formatTimestampToDate, properCaseName } = require('../utils')
const config = require('../config')
const { logError } = require('../logError')

const serviceUnavailableMessage = 'Sorry, the service is unavailable'
const getOffenderUrl = offenderNo => `${config.app.notmEndpointUrl}offenders/${offenderNo}`

const alertFactory = elite2Api => {
  const displayCloseAlertForm = async (req, res) => {
    const { offenderNo, alertId } = req.query
    let alert
    const offenderDetails = { offenderNo, profileUrl: getOffenderUrl(offenderNo) }
    const errors = []

    try {
      const { bookingId, firstName, lastName } = await elite2Api.getDetails(res.locals, offenderNo)
      const response = await elite2Api.getAlert(res.locals, bookingId, alertId)

      offenderDetails.bookingId = bookingId
      offenderDetails.name = `${properCaseName(lastName)}, ${properCaseName(firstName)}`
      alert = {
        ...response,
        dateCreated: formatTimestampToDate(response.dateCreated),
      }
    } catch (error) {
      logError(req.originalUrl, error)
      errors.push({ text: serviceUnavailableMessage })
    }

    if (alert && alert.expired) errors.push({ text: 'This alert has already expired' })

    if (errors.length > 0) req.flash('errors', errors)

    res.render('closeAlertForm.njk', {
      title: 'Close alert - Digital Prison Services',
      alert,
      offenderDetails,
      errors: req.flash('errors'),
      formAction: `/api/close-alert/${offenderDetails.bookingId}/${alertId}`,
    })
  }

  const handleCloseAlertForm = async (req, res) => {
    const { bookingId, alertId } = req.params
    const { alertStatus, offenderNo } = req.body
    const errors = []

    if (!alertStatus) {
      errors.push({
        text: 'Select yes if you want to close this alert',
        href: '#alertStatus',
      })
    }

    if (alertStatus === 'yes') {
      try {
        await elite2Api.updateAlert(res.locals, bookingId, alertId, {
          alertStatus: 'INACTIVE',
          expiryDate: moment().format('YYYY-MM-DD'),
        })
      } catch (error) {
        logError(req.originalUrl, error)
        errors.push({
          text: serviceUnavailableMessage,
        })
      }
    }

    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect('back')
    }

    return res.redirect(`${getOffenderUrl(offenderNo)}/alerts`)
  }

  return { displayCloseAlertForm, handleCloseAlertForm }
}

module.exports = { alertFactory }

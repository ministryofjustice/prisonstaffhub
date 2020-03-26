const express = require('express')
const { requestBookingFactory } = require('../../controllers/appointments/requestBooking')

const router = express.Router({ mergeParams: true })

const controller = ({ logError, notifyClient, whereaboutsApi, oauthApi, elite2Api }) => {
  const {
    startOfJourney,
    checkAvailability,
    selectCourt,
    validateCourt,
    enterOffenderDetails,
    createBookingRequest,
    confirm,
  } = requestBookingFactory({
    logError,
    notifyClient,
    whereaboutsApi,
    oauthApi,
    elite2Api,
  })

  router.get('/', startOfJourney)
  router.post('/check-availability', checkAvailability)
  router.get('/select-court', selectCourt)
  router.post('/validate-court', validateCourt)
  router.get('/enter-offender-details', enterOffenderDetails)
  router.post('/create-booking-request', createBookingRequest)
  router.get('/confirmation', confirm)

  return router
}

module.exports = dependencies => controller(dependencies)
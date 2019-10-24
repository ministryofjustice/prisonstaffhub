const moment = require('moment')
const { DAY_MONTH_YEAR, DATE_TIME_FORMAT_SPEC } = require('../../src/dateHelpers')

const bulkAppointmentsUploadFactory = (csvParserService, offenderLoader, logError) => {
  const renderError = (req, res, error) => {
    if (error) logError(req.originalUrl, error, 'Sorry, the service is unavailable')

    return res.render('error.njk', { url: '/bulk-appointments/need-to-upload-file' })
  }

  const index = async (req, res) => {
    const { data } = req.session

    if (!req.session.data) {
      return res.redirect('/bulk-appointments/add-appointment-details')
    }

    const appointmentDetails = {
      ...data,
      date: moment(data.date, DAY_MONTH_YEAR).format(DATE_TIME_FORMAT_SPEC),
    }

    return res.render('uploadOffenders.njk', {
      errors: req.flash('errors'),
      appointmentDetails,
    })
  }

  const getNonExistingOffenderNumbers = (uploadedList, prisonersList) => {
    const matchingPrisonerNumbers = []
    uploadedList.forEach(uploadedOffenderNo =>
      prisonersList.forEach(prisoner => {
        if (uploadedOffenderNo === prisoner.offenderNo) {
          matchingPrisonerNumbers.push(uploadedOffenderNo)
        }
      })
    )

    return uploadedList.filter(x => matchingPrisonerNumbers.indexOf(x) < 0)
  }

  const post = async (req, res) => {
    const { file } = req.files
    const { activeCaseLoadId } = req.session.userDetails

    try {
      return csvParserService
        .loadAndParseCsvFile(file)
        .then(async fileContent => {
          const fileContentWithNoHeader = fileContent[0][0] === 'Prison number' ? fileContent.slice(1) : fileContent
          const prisonersDetails = await offenderLoader.loadFromCsvContent(
            res.locals,
            fileContentWithNoHeader,
            activeCaseLoadId
          )

          const removeDuplicates = array => [...new Set(array)]
          const offendersFromCsv = removeDuplicates(fileContentWithNoHeader.map(row => row[0]))

          const prisonerList = prisonersDetails.map(prisoner => ({
            bookingId: prisoner.bookingId,
            offenderNo: prisoner.offenderNo,
            firstName: prisoner.firstName,
            lastName: prisoner.lastName,
          }))

          const offenderNosNotFound = getNonExistingOffenderNumbers(offendersFromCsv, prisonerList)

          if (offenderNosNotFound.length === fileContent.length) {
            return res.redirect('/bulk-appointments/no-appointments-added?reason=offendersNotFound')
          }

          req.session.data.prisonersListed = prisonerList

          req.session.data.prisonersNotFound = offenderNosNotFound

          return res.redirect('/bulk-appointments/confirm-appointments')
        })
        .catch(error => {
          req.flash('errors', { text: error.message, href: '#file' })
          return res.redirect('back')
        })
    } catch (error) {
      return renderError(req, res, error)
    }
  }

  return {
    index,
    post,
  }
}

module.exports = { bulkAppointmentsUploadFactory }

const moment = require('moment')

const { putLastNameFirst } = require('../../utils')
const { alertFlagLabels } = require('../../shared/alertFlagValues')

module.exports = ({ movementService, logError }) => async (req, res) => {
  const { activeCaseLoadId } = req.session.userDetails
  try {
    const offendersInReception = await movementService.getOffendersInReception(res.locals, activeCaseLoadId)

    const offenders = offendersInReception
      .sort((left, right) => left.lastName.localeCompare(right.lastName))
      .map(offender => ({
        offenderNo: offender.offenderNo,
        dateOfBirth: moment(offender.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        name: putLastNameFirst(offender.firstName, offender.lastName),
        fromAgencyDescription: offender.fromAgencyDescription,
        alerts: offender.alerts
          .map(alertCode => alertFlagLabels.find(alertLabel => alertLabel.alertCodes.includes(alertCode)))
          .filter(Boolean)
          .map(alertLabel => ({ classes: alertLabel.classes, label: alertLabel.label })),
        iepLevel: offender.iepLevel,
      }))

    return res.render('establishmentRoll/inReception.njk', {
      offenders,
    })
  } catch (error) {
    logError(req.originalUrl, error, 'Error trying to load in-reception page')
    return res.render('error.njk', { url: '/establishment-roll/in-reception' })
  }
}

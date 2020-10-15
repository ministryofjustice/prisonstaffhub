const { properCaseName, putLastNameFirst } = require('../../utils')

module.exports = ({ prisonApi, logError }) => async (req, res) => {
  const { offenderNo } = req.params

  try {
    const { cellId } = req.query
    const { firstName, lastName } = await prisonApi.getDetails(res.locals, offenderNo)
    const { description } = await prisonApi.getLocation(res.locals, cellId)

    return res.render('cellMove/confirmation.njk', {
      title: `${properCaseName(firstName)} ${properCaseName(lastName)} has been moved to cell ${description}`,
      breadcrumbPrisonerName: putLastNameFirst(firstName, lastName),
      offenderNo,
      prisonerProfileLink: `/prisoner/${offenderNo}`,
      prisonerSearchLink: '/prisoner-search',
    })
  } catch (error) {
    if (error) logError(req.originalUrl, error, 'Failed to load cell move confirmation page')

    return res.render('error.njk', {
      url: `/prisoner/${offenderNo}/cell-move/select-location`,
      homeUrl: `/prisoner/${offenderNo}`,
    })
  }
}

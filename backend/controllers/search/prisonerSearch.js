const qs = require('querystring')
const { serviceUnavailableMessage } = require('../../common-messages')
const alertFlagValues = require('../../shared/alertFlagValues')
const { putLastNameFirst } = require('../../utils')
const config = require('../../config')

module.exports = ({ paginationService, elite2Api, logError }) => {
  const index = async (req, res) => {
    const {
      user: { activeCaseLoad },
    } = res.locals
    const fullUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    const {
      location,
      keywords,
      alerts,
      pageOffsetOption,
      view,
      sortFieldsWithOrder = 'lastName,firstName:ASC',
    } = req.query

    const selectedAlerts = alerts && alerts.map(alert => alert.split(',')).flat()

    const pageOffset = (pageOffsetOption && parseInt(pageOffsetOption, 10)) || 0
    const pageLimit = 50
    const [sortFields, sortOrder] = sortFieldsWithOrder.split(':')

    const currentUserCaseLoad = activeCaseLoad && activeCaseLoad.caseLoadId

    try {
      const context = {
        ...res.locals,
        requestHeaders: {
          'Page-Offset': pageOffset,
          'Page-Limit': pageLimit,
          'Sort-Fields': sortFields,
          'Sort-Order': sortOrder,
        },
      }

      const [locations, prisoners] = await Promise.all([
        elite2Api.userLocations(res.locals),
        elite2Api.getInmates(context, location || currentUserCaseLoad, {
          keywords,
          alerts: selectedAlerts,
          returnIep: 'true',
          returnAlerts: 'true',
          returnCategory: 'true',
        }),
      ])

      const totalRecords = context.responseHeaders['total-records']

      const locationOptions =
        locations && locations.map(option => ({ value: option.locationPrefix, text: option.description }))

      const results =
        prisoners &&
        prisoners.map(prisoner => ({
          ...prisoner,
          name: putLastNameFirst(prisoner.firstName, prisoner.lastName),
          alerts: alertFlagValues.filter(alertFlag =>
            alertFlag.alertCodes.some(alert => prisoner.alertsDetails && prisoner.alertsDetails.includes(alert))
          ),
        }))

      return res.render('prisonerSearch/prisonerSearch.njk', {
        alertOptions: alertFlagValues.map(({ alertCodes, label }) => ({
          value: alertCodes,
          text: label,
          checked: Boolean(selectedAlerts) && selectedAlerts.some(alert => alertCodes.includes(alert)),
        })),
        formValues: req.query,
        locationOptions,
        notmUrl: config.app.notmEndpointUrl,
        pagination: paginationService.getPagination(totalRecords, pageOffset, pageLimit, fullUrl),
        results,
        searchUrl: `${req.baseUrl}?${qs.stringify({ location, keywords, alerts, pageOffsetOption })}`,
        totalRecords,
        view,
      })
    } catch (error) {
      if (error) logError(req.originalUrl, error, serviceUnavailableMessage)

      return res.render('error.njk', { url: '/', homeUrl: '/' })
    }
  }

  const post = (req, res) => {
    const { alerts, ...queries } = req.query

    return res.redirect(
      `${req.baseUrl}?${qs.stringify({
        ...queries,
        ...(alerts ? { 'alerts[]': alerts } : {}),
        sortFieldsWithOrder: req.body.sortFieldsWithOrder,
      })}`
    )
  }

  return {
    index,
    post,
  }
}
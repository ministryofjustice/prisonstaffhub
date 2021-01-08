const {
  app: { notmEndpointUrl: dpsUrl },
} = require('../../config')
const { raiseAnalyticsEvent } = require('../../raiseAnalyticsEvent')

const { properCaseName, putLastNameFirst } = require('../../utils')

const CSWAP = 'C-SWAP'

module.exports = ({ prisonApi, whereaboutsApi, caseNotesApi, logError }) => {
  const index = async (req, res) => {
    const { offenderNo } = req.params
    const { cellId } = req.query
    const isCellSwap = cellId === CSWAP

    if (!cellId) return res.redirect(`/prisoner/${offenderNo}/cell-move/select-cell`)

    const { locationPrefix, description } = isCellSwap
      ? { description: 'swap' }
      : await prisonApi.getLocation(res.locals, cellId)

    const { firstName, lastName } = await prisonApi.getDetails(res.locals, offenderNo)

    const formValues = req.flash('formValues')
    const { reason, comment } = (formValues && formValues[0]) || {}

    const caseNoteTypes = (!isCellSwap && (await caseNotesApi.getCaseNoteTypes(res.locals))) || []
    const cellMoveTypes = caseNoteTypes.find(type => type.code === 'MOVED_CELL')
    const cellMoveReasonRadioValues = cellMoveTypes?.subCodes.map(subType => ({
      value: subType.code,
      text: subType.description,
      checked: subType.code === reason,
    }))

    return res.render('cellMove/confirmCellMove.njk', {
      dpsUrl,
      showWarning: !isCellSwap,
      offenderNo,
      description,
      breadcrumbPrisonerName: putLastNameFirst(firstName, lastName),
      name: `${properCaseName(firstName)} ${properCaseName(lastName)}`,
      cellId,
      locationPrefix,
      selectCellUrl: `/prisoner/${offenderNo}/cell-move/select-cell`,
      cellMoveReasonRadioValues,
      errors: req.flash('errors'),
      formValues: {
        comment,
      },
    })
  }

  const makeCellMove = async (res, { cellId, bookingId, agencyId, offenderNo, reasonCode, commentText }) => {
    const { capacity } = await prisonApi.getAttributesForLocation(res.locals, cellId)
    const { locationPrefix, description } = await prisonApi.getLocation(res.locals, cellId)

    try {
      await whereaboutsApi.moveToCell(res.locals, {
        bookingId,
        offenderNo,
        internalLocationDescriptionDestination: locationPrefix,
        cellMoveReasonCode: reasonCode,
        commentText,
      })
    } catch (error) {
      if (error.status === 400)
        return res.redirect(`/prisoner/${offenderNo}/cell-move/cell-not-available?cellDescription=${description}`)
      throw error
    }

    raiseAnalyticsEvent(
      'Cell move',
      `Cell move for ${agencyId}`,
      `Cell type - ${capacity === 1 ? 'Single occupancy' : 'Multi occupancy'}`
    )

    return res.redirect(`/prisoner/${offenderNo}/cell-move/confirmation?cellId=${cellId}`)
  }

  const makeCSwap = async (res, { bookingId, agencyId, offenderNo }) => {
    await prisonApi.moveToCellSwap(res.locals, { bookingId })

    raiseAnalyticsEvent('Cell move', `Cell move for ${agencyId}`, `Cell type - C-SWAP`)

    return res.redirect(`/prisoner/${offenderNo}/cell-move/cswap-confirmation`)
  }

  const validate = ({ reason, comment }) => {
    const errors = []

    if (!reason) errors.push({ href: '#reason', text: 'Select the reason for the cell move' })
    if (!comment) errors.push({ href: '#comment', text: 'Enter what happened for you to change this person’s cell' })
    if (comment && comment.length < 7) {
      errors.push({
        href: '#comment',
        text: 'Enter a real explanation of what happened for you to change this person’s cell',
      })
    }
    if (comment && comment.length > 4000) {
      errors.push({
        href: '#comment',
        text: 'Enter what happened for you to change this person’s cell using 4,000 characters or less',
      })
    }

    return errors
  }

  const post = async (req, res) => {
    const { offenderNo } = req.params
    const { cellId, reason, comment } = req.body

    if (!cellId) return res.redirect(`/prisoner/${offenderNo}/cell-move/select-cell`)

    if (cellId !== CSWAP) {
      const errors = validate({ reason, comment })

      if (errors.length) {
        req.flash('formValues', { comment, reason })
        req.flash('errors', errors)
        return res.redirect(`/prisoner/${offenderNo}/cell-move/confirm-cell-move?cellId=${cellId}`)
      }
    }

    try {
      const { bookingId, agencyId } = await prisonApi.getDetails(res.locals, offenderNo)

      if (cellId === 'C-SWAP') return await makeCSwap(res, { agencyId, bookingId, offenderNo })

      return await makeCellMove(res, {
        cellId,
        bookingId,
        agencyId,
        offenderNo,
        reasonCode: reason,
        commentText: comment,
      })
    } catch (error) {
      if (error) logError(req.originalUrl, error, `Failed to make cell move to ${cellId}`)

      res.status(500)

      return res.render('error.njk', {
        url: `/prisoner/${offenderNo}/cell-move/select-cell`,
        homeUrl: `/prisoner/${offenderNo}`,
      })
    }
  }

  return {
    index,
    post,
  }
}

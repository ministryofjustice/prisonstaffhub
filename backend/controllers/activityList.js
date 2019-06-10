const { switchDateFormat, sortByDateTime } = require('../utils')
const log = require('../log')
const getExternalEventsForOffenders = require('../shared/getExternalEventsForOffenders')

const offenderNumberMultiMap = offenderNumbers =>
  offenderNumbers.reduce((map, offenderNumber) => map.set(offenderNumber, []), new Map())

const sortActivitiesByEventThenByLastName = data => {
  data.sort((a, b) => {
    if (a.comment < b.comment) return -1
    if (a.comment > b.comment) return 1

    if (a.lastName < b.lastName) return -1
    if (a.lastName > b.lastName) return 1

    return 0
  })
}

const extractAttendanceInfo = (attendanceInformation, offenderBookingIds, event) => {
  if (attendanceInformation && attendanceInformation.length > 0) {
    const offenderBookingId = offenderBookingIds.find(
      offenderBooking => offenderBooking.offenderNo === event.offenderNo
    ).bookingId

    const offenderAttendanceInfo = attendanceInformation.find(attendance => attendance.bookingId === offenderBookingId)
    const { id, absentReason, attended, paid, comments } = offenderAttendanceInfo || {}
    const attendanceInfo = { id, absentReason, comments, paid }

    if (offenderAttendanceInfo && absentReason) attendanceInfo.other = true

    if (offenderAttendanceInfo && attended && paid) attendanceInfo.pay = true

    return attendanceInfo
  }

  return null
}

const getActivityListFactory = (elite2Api, whereaboutsApi, config) => {
  const {
    app: { updateAttendanceEnabled },
  } = config

  const getEventsForOffenderNumbers = async (context, { agencyId, date, timeSlot, offenderNumbers }) => {
    const searchCriteria = { agencyId, date, timeSlot, offenderNumbers }
    const eventsByKind = await Promise.all([
      elite2Api.getVisits(context, searchCriteria),
      elite2Api.getAppointments(context, searchCriteria),
      elite2Api.getActivities(context, searchCriteria),
    ])
    return [...eventsByKind[0], ...eventsByKind[1], ...eventsByKind[2]] // Meh. No flatMap or flat.
  }

  const getActivityList = async (context, agencyId, locationIdString, frontEndDate, timeSlot) => {
    const locationId = Number.parseInt(locationIdString, 10)
    const date = switchDateFormat(frontEndDate)

    const getEventsAtLocation = usage =>
      elite2Api.getActivityList(context, { agencyId, locationId, usage, date, timeSlot })

    const eventsAtLocationByUsage = await Promise.all([
      getEventsAtLocation('PROG'),
      getEventsAtLocation('VISIT'),
      getEventsAtLocation('APP'),
    ])

    const eventsAtLocation = [
      ...eventsAtLocationByUsage[0],
      ...eventsAtLocationByUsage[1],
      ...eventsAtLocationByUsage[2],
    ] // Meh. No flatMap or flat.

    log.info(eventsAtLocation, 'events at location')

    const offenderNumbersWithDuplicates = eventsAtLocation.map(event => event.offenderNo)
    const offenderNumbers = [...new Set(offenderNumbersWithDuplicates)]
    let offenderBookingIds
    if (updateAttendanceEnabled)
      offenderBookingIds = await Promise.all(
        offenderNumbers.map(offenderNo => elite2Api.getDetailsLight(context, offenderNo))
      )

    const attendanceInformation = updateAttendanceEnabled
      ? await whereaboutsApi.getAttendance(context, {
          agencyId,
          locationId,
          date,
          period: timeSlot,
        })
      : null

    const externalEventsForOffenders = await getExternalEventsForOffenders(elite2Api, context, {
      offenderNumbers,
      formattedDate: date,
      agencyId,
    })
    const eventsForOffenderNumbers = await getEventsForOffenderNumbers(context, {
      agencyId,
      date,
      timeSlot,
      offenderNumbers,
    })

    const eventsElsewhere = eventsForOffenderNumbers.filter(event => event.locationId !== locationId)
    const eventsElsewhereByOffenderNumber = offenderNumberMultiMap(offenderNumbers)

    eventsElsewhere.forEach(event => {
      const events = eventsElsewhereByOffenderNumber.get(event.offenderNo)
      if (events) events.push(event)
    })

    const events = eventsAtLocation.map(event => {
      const {
        releaseScheduled,
        courtEvents,
        scheduledTransfers,
        alertFlags,
        category,
      } = externalEventsForOffenders.get(event.offenderNo)

      const eventsElsewhereForOffender = eventsElsewhereByOffenderNumber
        .get(event.offenderNo)
        .sort((left, right) => sortByDateTime(left.startTime, right.startTime))

      const attendanceInfo = updateAttendanceEnabled
        ? extractAttendanceInfo(attendanceInformation, offenderBookingIds, event)
        : {}

      return {
        ...event,
        eventsElsewhere: eventsElsewhereForOffender,
        releaseScheduled,
        courtEvents,
        scheduledTransfers,
        alertFlags,
        category,
        attendanceInfo,
      }
    })

    sortActivitiesByEventThenByLastName(events)

    return events
  }

  return {
    getActivityList,
  }
}

module.exports = { getActivityListFactory }

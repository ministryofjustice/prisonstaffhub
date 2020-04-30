const attendanceChangeRouter = require('../routes/attendanceChangesRouter')

describe('Attendance change router', () => {
  const elite2Api = {}
  const whereaboutsApi = {}
  const oauthApi = {}
  const res = {
    locals: {},
  }

  let req
  let router
  let logError

  beforeEach(() => {
    whereaboutsApi.getAttendanceChanges = jest.fn()
    elite2Api.getScheduledActivities = jest.fn()
    oauthApi.userDetails = jest.fn()

    whereaboutsApi.getAttendanceChanges.mockReturnValue({ changes: [] })
    elite2Api.getScheduledActivities.mockReturnValue([])
    oauthApi.userDetails.mockReturnValue({ username: 'username1', name: 'First name last name' })

    logError = jest.fn()

    router = attendanceChangeRouter({ elite2Api, whereaboutsApi, oauthApi, logError })
    res.render = jest.fn()
    res.redirect = jest.fn()

    req = {
      originalUrl: 'http://localhost',
      query: {
        fromDateTime: '2020-10-03T00:00',
        toDateTime: '2020-10-03T12:00',
        subHeading: '3 November 2020 - AM + PM',
      },
    }
  })

  it('should request changes for a given date time range', async () => {
    await router(req, res)

    expect(whereaboutsApi.getAttendanceChanges).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        fromDateTime: '2020-10-03T00:00',
        toDateTime: '2020-10-03T12:00',
      })
    )
  })

  it('should make a request for scheduled activity that has been changed', async () => {
    whereaboutsApi.getAttendanceChanges.mockReturnValue({
      changes: [{ eventId: 1 }, { eventId: 1 }, { eventId: 2 }],
    })

    await router(req, res)

    expect(elite2Api.getScheduledActivities).toHaveBeenCalledWith({}, { agencyId: 'MDI', eventIds: [1, 2] })
  })

  it('should make a request to get user details', async () => {
    whereaboutsApi.getAttendanceChanges.mockReturnValue({
      changes: [
        { eventId: 1, changedBy: 'username1' },
        { eventId: 2, changedBy: 'username2' },
        { eventId: 3, changedBy: 'username2' },
      ],
    })

    await router(req, res)

    expect(oauthApi.userDetails).toHaveBeenCalledWith({}, 'username1')
    expect(oauthApi.userDetails).toHaveBeenCalledWith({}, 'username2')
  })

  it('should return table rows in the right order and format', async () => {
    whereaboutsApi.getAttendanceChanges.mockReturnValue({
      changes: [
        {
          eventId: 1,
          changedBy: 'username',
          changedFrom: 'Refused',
          changedTo: 'Attended',
          changedOn: '2020-10-02T17:00',
        },
        {
          eventId: 2,
          changedBy: 'username',
          changedFrom: 'AcceptableAbsence',
          changedTo: 'Refused',
          changedOn: '2020-10-02T11:00',
        },
      ],
    })

    elite2Api.getScheduledActivities.mockReturnValue([
      { eventId: 1, firstName: 'first name 1', lastName: 'last name', comment: 'Wood work', offenderNo: 'A123456' },
      { eventId: 2, firstName: 'first name 2', lastName: 'last name', comment: 'Kitchen', offenderNo: 'A23457' },
    ])

    oauthApi.userDetails.mockReturnValue({ name: 'staff full name', username: 'username' })

    await router(req, res)

    expect(res.render).toHaveBeenCalledWith(
      'attendanceChanges.njk',
      expect.objectContaining({
        dpsUrl: 'http://localhost:3000/',
        subHeading: '3 November 2020 - AM + PM',
        attendanceChanges: [
          [
            {
              attributes: { 'data-sort-value': 'last name' },
              html: '<a href="http://localhost:3000/offenders/A23457" class="govuk-link">First name 2 Last name</a>',
            },
            { text: 'A23457' },
            { text: 'Kitchen' },
            { text: 'Acceptable absence' },
            { text: 'Refused' },
            { attributes: { 'data-sort-value': 1601632800 }, text: '2 October 2020 - 11:00' },
            { text: 'staff full name' },
          ],
          [
            {
              attributes: { 'data-sort-value': 'last name' },
              html: '<a href="http://localhost:3000/offenders/A123456" class="govuk-link">First name 1 Last name</a>',
            },
            { text: 'A123456' },
            { text: 'Wood work' },
            { text: 'Refused' },
            { text: 'Attended' },
            { attributes: { 'data-sort-value': 1601654400 }, text: '2 October 2020 - 17:00' },
            { text: 'staff full name' },
          ],
        ],
      })
    )
  })

  it('should log error and render error template', async () => {
    whereaboutsApi.getAttendanceChanges.mockRejectedValue(new Error('Network error'))

    await router(req, res)

    expect(logError).toHaveBeenCalledWith(
      'http://localhost',
      new Error('Network error'),
      'Sorry, the service is unavailable'
    )
    expect(res.render).toHaveBeenCalledWith('error.njk')
  })

  it('should redirect back to the attendance dashboard when any query parameters are missing', async () => {
    req.query = {}
    await router(req, res)

    expect(res.redirect).toHaveBeenCalledWith('/manage-prisoner-whereabouts/attendance-reason-statistics')
  })

  it('should render page when there are no changes', async () => {
    await router(req, res)

    expect(res.redirect).toHaveBeenCalledTimes(0)
    expect(res.render).toHaveBeenCalledWith(
      'attendanceChanges.njk',
      expect.objectContaining({
        attendanceChanges: [],
        dpsUrl: 'http://localhost:3000/',
        subHeading: '3 November 2020 - AM + PM',
      })
    )
  })
})

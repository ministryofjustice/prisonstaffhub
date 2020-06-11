const covidDashboard = require('../controllers/covid/covidDashboard')

describe('covid dashboard', () => {
  let req
  let res
  let logError
  let covidService
  let controller

  beforeEach(() => {
    req = {
      originalUrl: 'http://localhost',
    }
    res = { locals: { user: { activeCaseLoad: { caseLoadId: 'MDI' } } }, render: jest.fn() }

    logError = jest.fn()

    covidService = {
      getCount: jest.fn(),
    }
    controller = covidDashboard({ covidService, logError })
  })

  it('should render view with counts', async () => {
    covidService.getCount
      .mockResolvedValueOnce(21)
      .mockResolvedValueOnce(16)
      .mockResolvedValueOnce(9)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(14)

    await controller(req, res)

    expect(logError).not.toHaveBeenCalled()

    expect(covidService.getCount).toHaveBeenCalledWith(res)
    expect(covidService.getCount).toHaveBeenCalledWith(res, 'URCU')
    expect(covidService.getCount).toHaveBeenCalledWith(res, 'UPIU')
    expect(covidService.getCount).toHaveBeenCalledWith(res, 'USU')
    expect(covidService.getCount).toHaveBeenCalledWith(res, 'URS')

    expect(res.render).toHaveBeenCalledWith(
      'covid/dashboard.njk',
      expect.objectContaining({
        dashboardStats: {
          prisonPopulation: 21,
          reverseCohortingUnit: 16,
          protectiveIsolationUnit: 9,
          shieldingUnit: 5,
          refusingToShield: 14,
        },
      })
    )
  })

  it('should handle errors', async () => {
    const error = Error('unexpected err')
    covidService.getCount.mockRejectedValue(error)

    await controller(req, res)

    expect(logError).toHaveBeenCalledWith('http://localhost', error, 'Failed to load dashboard stats')

    expect(res.render).toHaveBeenCalledWith(
      'error.njk',
      expect.objectContaining({
        url: '/current-covid-units',
      })
    )
  })
})

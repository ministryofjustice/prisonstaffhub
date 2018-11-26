import sortActivityData from './activityResultsSorter'

describe('Activity results sorter tests', () => {
  it('sorts an empty array', () => {
    sortActivityData([], 'lastName', 'ASC')
  })

  describe('sort by last name', () => {
    describe('activity', () => {
      const data = [{ lastName: 'B' }, { lastName: 'A' }, { lastName: 'C' }]

      it('ascending', () => {
        sortActivityData(data, 'lastName', 'ASC')
        expect(data).toEqual([{ lastName: 'A' }, { lastName: 'B' }, { lastName: 'C' }])
      })

      it('descending', () => {
        sortActivityData(data, 'lastName', 'DESC')
        expect(data).toEqual([{ lastName: 'C' }, { lastName: 'B' }, { lastName: 'A' }])
      })
    })
  })

  describe('sort by last name, then firstName', () => {
    describe('activity', () => {
      const data = [
        { lastName: 'B', firstName: 'P' },
        { lastName: 'A', firstName: 'Q' },
        { lastName: 'A', firstName: 'P' },
        { lastName: 'B', firstName: 'Q' },
      ]

      it('ascending', () => {
        sortActivityData(data, 'lastName', 'ASC')
        expect(data).toEqual([
          { lastName: 'A', firstName: 'P' },
          { lastName: 'A', firstName: 'Q' },
          { lastName: 'B', firstName: 'P' },
          { lastName: 'B', firstName: 'Q' },
        ])
      })

      it('descending', () => {
        sortActivityData(data, 'lastName', 'DESC')
        expect(data).toEqual([
          { lastName: 'B', firstName: 'Q' },
          { lastName: 'B', firstName: 'P' },
          { lastName: 'A', firstName: 'Q' },
          { lastName: 'A', firstName: 'P' },
        ])
      })
    })
  })

  describe('Sort by cellLocation', () => {
    const data = [{ cellLocation: 'MDI-1-2-007' }, { cellLocation: 'MDI-1-2-006' }, { cellLocation: 'MDI-1-1-007' }]

    it('ascending', () => {
      sortActivityData(data, 'cellLocation', 'ASC')
      expect(data).toEqual([
        { cellLocation: 'MDI-1-1-007' },
        { cellLocation: 'MDI-1-2-006' },
        { cellLocation: 'MDI-1-2-007' },
      ])
    })
  })

  describe('Sort by activity (eventDescription), then lastName, then firstName', () => {
    const data = [
      { event: 'PA', comment: 'B' },
      { eventType: 'PRISON_ACT', comment: 'A' },
      { comment: 'D', eventDescription: 'F' },
      { comment: 'D', eventDescription: 'E' },
      { eventDescription: 'C' },
      { eventDescription: 'C', lastName: 'B', firstName: 'P' },
      { eventDescription: 'C', lastName: 'A', firstName: 'Q' },
      { eventDescription: 'C', lastName: 'A', firstName: 'P' },
      { eventDescription: 'C', lastName: 'B', firstName: 'Q' },
    ]
    it('sorts ascending', () => {
      sortActivityData(data, 'activity', 'ASC')
      expect(data).toEqual([
        { eventType: 'PRISON_ACT', comment: 'A' },
        { event: 'PA', comment: 'B' },
        { eventDescription: 'C', lastName: 'A', firstName: 'P' },
        { eventDescription: 'C', lastName: 'A', firstName: 'Q' },
        { eventDescription: 'C', lastName: 'B', firstName: 'P' },
        { eventDescription: 'C', lastName: 'B', firstName: 'Q' },
        { eventDescription: 'C' },
        { comment: 'D', eventDescription: 'E' },
        { comment: 'D', eventDescription: 'F' },
      ])
    })
  })
})

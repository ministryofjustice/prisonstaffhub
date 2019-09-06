import {
  capitalize,
  properCaseName,
  mapToQueryString,
  formatDaysInYears,
  formatMonthsAndDays,
  formatTimestampToDateTime,
  formatTimestampToDate,
  formatName,
  getCurrentPeriod,
  isToday,
  isTodayOrAfter,
  flagFuturePeriodSelected,
  readablePeriod,
} from './utils'

describe('capitalize()', () => {
  describe('when a string IS NOT provided', () => {
    it('should return an empty string', () => {
      expect(capitalize()).toEqual('')
      expect(capitalize(['array item 1, array item 2'])).toEqual('')
      expect(capitalize({ key: 'value' })).toEqual('')
      expect(capitalize(1)).toEqual('')
    })
  })

  describe('when a string IS provided', () => {
    it('should handle uppercased strings', () => {
      expect(capitalize('HOUSEBLOCK 1')).toEqual('Houseblock 1')
    })

    it('should handle lowercased strings', () => {
      expect(capitalize('houseblock 1')).toEqual('Houseblock 1')
    })

    it('should handle multiple word strings', () => {
      expect(capitalize('Segregation Unit')).toEqual('Segregation unit')
    })
  })
})

describe('properCaseName', () => {
  it('null string', () => {
    expect(properCaseName(null)).toEqual('')
  })
  it('empty string', () => {
    expect(properCaseName('')).toEqual('')
  })
  it('Lower Case', () => {
    expect(properCaseName('bob')).toEqual('Bob')
  })
  it('Mixed Case', () => {
    expect(properCaseName('GDgeHHdGr')).toEqual('Gdgehhdgr')
  })
  it('Multiple words', () => {
    expect(properCaseName('BOB SMITH')).toEqual('Bob smith')
  })
  it('Hyphenated', () => {
    expect(properCaseName('MONTGOMERY-FOSTER-SMYTH-WALLACE-BOB')).toEqual('Montgomery-Foster-Smyth-Wallace-Bob')
  })
})

describe('mapToQueryParams', () => {
  it('should handle empty maps', () => {
    expect(mapToQueryString({})).toEqual('')
  })

  it('should handle single key values', () => {
    expect(mapToQueryString({ key1: 'val' })).toEqual('key1=val')
  })

  it('should handle non-string, scalar values', () => {
    expect(mapToQueryString({ key1: 1, key2: true })).toEqual('key1=1&key2=true')
  })

  it('should ignore null values', () => {
    expect(mapToQueryString({ key1: 1, key2: null })).toEqual('key1=1')
  })

  it('should handle encode values', () => {
    expect(mapToQueryString({ key1: "Hi, I'm here" })).toEqual("key1=Hi%2C%20I'm%20here")
  })
})

describe('formatDaysInYears', () => {
  it('should return correct string when more than one days and years present', () => {
    expect(formatDaysInYears(812)).toEqual('2 years, 82 days')
  })

  it('should return correct string when 1 year and 1 day', () => {
    expect(formatDaysInYears(366)).toEqual('1 year, 1 day')
  })

  it('should return correct string when 0 years and multiple days', () => {
    expect(formatDaysInYears(250)).toEqual('250 days')
  })

  it('should return correct string when multiple years and no days', () => {
    expect(formatDaysInYears(365 * 2)).toEqual('2 years')
  })
})

describe('formatMonthsAndDay', () => {
  it('should return correct string when no years or days', () => {
    expect(formatMonthsAndDays(null, null)).toEqual('')
    expect(formatMonthsAndDays(0, 0)).toEqual('')
  })

  it('should return correct string when 1 month and no days', () => {
    expect(formatMonthsAndDays(1, 0)).toEqual('1 month')
  })

  it('should return correct string when multiple month and no days', () => {
    expect(formatMonthsAndDays(2, 0)).toEqual('2 months')
  })

  it('should return correct string when 1 day and no months', () => {
    expect(formatMonthsAndDays(0, 1)).toEqual('1 day')
  })

  it('should return correct string when multiple days and no months', () => {
    expect(formatMonthsAndDays(0, 2)).toEqual('2 days')
  })

  it('should return correct string when 1 month and 1 day', () => {
    expect(formatMonthsAndDays(1, 1)).toEqual('1 month, 1 day')
  })

  it('should return correct string when multiple months and multiple days', () => {
    expect(formatMonthsAndDays(3, 23)).toEqual('3 months, 23 days')
  })
})

describe('formatTimestampToDate', () => {
  it('should format timestamp to date', () => {
    expect(formatTimestampToDate('2018-12-23T13:21')).toEqual('23/12/2018')
  })
  it('should not fail to parse absent timestamp', () => {
    expect(formatTimestampToDate(undefined)).toEqual(undefined)
  })
})

describe('formatTimestampToDateTime', () => {
  it('should format timestamp to date time', () => {
    expect(formatTimestampToDateTime('2018-12-23T13:21')).toEqual('23/12/2018 - 13:21')
  })
  it('should not fail to parse absent timestamp', () => {
    expect(formatTimestampToDateTime(undefined)).toEqual(undefined)
  })
})

describe('formatName', () => {
  it('Can format name', () => {
    expect(formatName('bob', 'smith')).toEqual('Bob Smith')
  })
  it('can format first name only', () => {
    expect(formatName('BOB', '')).toEqual('Bob')
  })
  it('can format last name only', () => {
    expect(formatName(undefined, 'Smith')).toEqual('Smith')
  })
  it('can format empty name', () => {
    expect(formatName('', '')).toEqual('')
  })
  it('can format no name', () => {
    expect(formatName(undefined, undefined)).toEqual('')
  })
})

describe('getCurrentPeriod()', () => {
  it('returns AM if time is post midnight', () => {
    expect(getCurrentPeriod('2019-08-11T00:00:01.000')).toEqual('AM')
  })

  it('returns AM if time is pre 12 noon', () => {
    expect(getCurrentPeriod('2019-08-11T11:59:59.000')).toEqual('AM')
  })

  it('returns PM if time is post 12 noon and before 5PM', () => {
    expect(getCurrentPeriod('2019-08-11T16:59:59.000')).toEqual('PM')
  })

  it('returns ED if time is post 5pm and before midnight', () => {
    expect(getCurrentPeriod('2019-08-11T23:59:59.000')).toEqual('ED')
  })
})

describe('readablePeriod()', () => {
  it('returns Morning if selected period is AM', () => {
    expect(readablePeriod('AM')).toEqual('Morning')
  })
  it('returns Afternoon if selected period is PM', () => {
    expect(readablePeriod('PM')).toEqual('Afternoon')
  })
  it('returns Evening if selected period is ED', () => {
    expect(readablePeriod('ED')).toEqual('Evening')
  })
})

describe('isToday()', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1547424000000) // Sunday 2019-01-13T00:00:00.000
  })

  afterAll(() => {
    Date.now.mockRestore()
  })

  it('returns true if date is "Today"', () => {
    expect(isToday('Today')).toBe(true)
  })

  it('returns false if date is before today', () => {
    expect(isToday('2/01/2019')).toBe(false)
  })

  it('returns false if date is after today', () => {
    expect(isToday('19/01/2019')).toBe(false)
  })
})

describe('isTodayOrAfter()', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1547424000000) // Sunday 2019-01-13T00:00:00.000
  })

  afterAll(() => {
    Date.now.mockRestore()
  })

  it('returns true if date is "Today"', () => {
    expect(isTodayOrAfter('Today')).toBe(true)
  })

  it('returns false if date is within the past week', () => {
    expect(isTodayOrAfter('2/01/2019')).toBe(false)
  })

  it('returns true if date is AFTER today', () => {
    expect(isTodayOrAfter('14/01/2019')).toBe(true)
  })

  it('returns true if date is within the next week', () => {
    expect(isTodayOrAfter('19/01/2019')).toBe(true)
  })
})

describe('flagFuturePeriodSelected()', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1547424000000) // Sunday 2019-01-13T00:00:00.000
  })

  afterAll(() => {
    Date.now.mockRestore()
  })

  it('returns true if selected period is in the future', () => {
    expect(flagFuturePeriodSelected('14/01/2019', 'ED', 'AM')).toEqual(true)
  })
  it('returns false if selected period is not in the future', () => {
    expect(flagFuturePeriodSelected('14/01/2019', 'PM', 'ED')).toEqual(false)
  })
})

import moment from 'moment-business-days'
import { DayOfTheWeek, DATE_TIME_FORMAT_SPEC } from '../dateHelpers'

const calculateEndDate = ({ startTime, repeats, numberOfTimes }) => {
  if (!startTime) return null

  const repeatsToMomentMap = {
    WEEKLY: 'weeks',
    DAILY: 'day',
    WEEKDAYS: 'day',
    YEARLY: 'years',
    MONTHLY: 'month',
    FORTNIGHTLY: 'weeks',
  }

  const unitOfTime = repeatsToMomentMap[repeats]

  if (repeats === 'WEEKDAYS') return moment(startTime, DATE_TIME_FORMAT_SPEC).businessAdd(numberOfTimes - 1, unitOfTime)

  if (repeats === 'FORTNIGHTLY')
    return moment(startTime, DATE_TIME_FORMAT_SPEC).add((numberOfTimes - 1) * 2, unitOfTime)

  return moment(startTime, DATE_TIME_FORMAT_SPEC).add(numberOfTimes - 1, unitOfTime)
}

const recurringEndDate = values => {
  const endDate = calculateEndDate({
    startTime: values.startTime,
    repeats: values.repeats,
    numberOfTimes: values.times,
  })

  return endDate && `${DayOfTheWeek(endDate)}, ${endDate.format('MMMM Do YYYY')}`
}

export default {
  calculateEndDate,
  recurringEndDate,
}

'use strict'

export default (monthlyEvents) => {
  monthlyEvents = monthlyEvents.sort((a, b) => {
    if (a._id < b._id) return 1
    return -1
  })
  return monthlyEvents
}

'use strict'

export default (events) => {
  events = events.sort((a, b) => {
    if (a._id < b._id) return -1
    return 1
  })
  return events
}
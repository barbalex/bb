'use strict'

export default (statistics) => {
  statistics = statistics.sort((a, b) => {
    if (a._id < b._id) return -1
    return 1
  })
  return statistics
}

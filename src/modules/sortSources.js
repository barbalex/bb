'use strict'

export default (sources) => {
  sources = sources.sort((a, b) => {
    if (a._id < b._id) return -1
    return 1
  })
  return sources
}

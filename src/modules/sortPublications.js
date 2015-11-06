'use strict'

export default (publications) => {
  publications = publications.sort((a, b) => {
    if (a._id < b._id) return 1
    return -1
  })
  return publications
}

'use strict'

import getYearFromEventId from './getYearFromEventId.js'
import getMonthFromEventId from './getMonthFromEventId.js'

export default (doc) => {
  if (doc.type !== 'monthlyEvents') return doc.title
  // if it is a monthly event:
  const year = getYearFromEventId(doc._id)
  const month = getMonthFromEventId(doc._id)
  return `${month} ${year}`
}

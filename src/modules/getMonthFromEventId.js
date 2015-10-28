'use strict'

import months from './months.js'

export default (id) => {
  const idArray = id.split('_')
  const month = idArray[2]
  return months()[month]
}

'use strict'

export default (id) => {
  const idArray = id.split('_')
  return {
    year: idArray[1],
    month: idArray[2],
    day: idArray[3]
  }
}

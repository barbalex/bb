import getMonths from './getMonths.js'

export default (id) => {
  const idArray = id.split('_')
  const month = idArray[2]
  return getMonths()[month]
}

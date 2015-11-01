'use strict'

export default (id) => {
  const idArray = id.split('_')
  const category = idArray[1]
  return category
}

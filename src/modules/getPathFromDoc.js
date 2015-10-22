'use strict'

export default (doc) => {
  let path = doc && doc._id ? doc._id : null
  console.log('getPathFromDocgetPathFromDoc.js, path received', path)
  if (path) {
    if (path.startsWith('pages_')) path = path.slice(6)
    path = path.replace(/_/g, '/')
  }
  console.log('getPathFromDocgetPathFromDoc.js, path to return', path)
  return path
}

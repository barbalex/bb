export default (doc) => {
  let path = doc && doc._id ? doc._id : null
  if (path) {
    if (path.startsWith('pages_')) path = path.slice(6)
    path = path.replace(/_/g, '/')
  }
  return path
}

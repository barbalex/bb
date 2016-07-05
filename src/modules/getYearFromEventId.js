export default (id) => {
  const idArray = id.split('_')
  const year = idArray[1]
  return year
}

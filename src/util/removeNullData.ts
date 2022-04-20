const removeNullData = (data:{}):{} => {
  // This removes null data recursivly from javascript objects
  return Object.fromEntries(
    Object.entries(data) // value is not null and not an empty object
      .filter(([_, v]) => v != null && JSON.stringify(v) !== '{}')
      .map(([k, v]) => [k, v === Object(v) ? removeNullData(v as {}) : v])
  )
}
export default removeNullData

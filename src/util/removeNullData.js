const removeNullData = (data) => {
  // This removes null data recursivly from javascript objects
  return Object.fromEntries(
    Object.entries(data)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? Object.fromEntries(Object.entries(v).filter(([_, v]) => v != null)) : v])
  )
}
export default removeNullData

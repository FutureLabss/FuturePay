exports.clearNullField = (obj) => {
  const keys = Object.keys(obj)
  const result = {}
  if (keys.length >= 1) {
    keys.forEach((item) => {
      if (obj[item]) {
        result[item] = obj[item]
      }
    })
    return result
  }
  return obj

}
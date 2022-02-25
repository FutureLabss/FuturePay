exports.generateFileName = (path, file) => {
  const ext = file.mimetype.split('/')[1]
  return `${path}${Math.random().toString(12).substr(2, 20)}.${ext}`
}

exports.fileTypeFilter = (file, allowed = ['jpg', 'jpeg', 'png', 'pdf']) => {
  const ext = file.mimetype.split('/')[1]
  return allowed.includes(ext)
}
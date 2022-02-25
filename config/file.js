const { fileTypeFilter, generateFileName } = require('../src/mixin/storage/multerConfig')

const multer = require('multer')


exports.transactionUpload = multer({
  storage: multer.diskStorage({
    destination: 'storage',
    filename: (req, file, cb) => cb(null, generateFileName('transactions/proof/', file))
  }),
  fileFilter: (req, file, cb) => cb(null, fileTypeFilter(file)),
  limits: { fileSize: 1024 * 1024 * 5 }
})


exports.profileUpload = multer({
  storage: multer.diskStorage({
    destination: 'storage/profile/avatar',
    filename: (req, file, cb) => cb(null, generateFileName('/', file))
  }),
  fileFilter: (req, file, cb) => cb(null, fileTypeFilter(file)),
  limits: { fileSize: 1024 * 1024 * 5 }
})

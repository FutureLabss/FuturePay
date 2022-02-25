
const bodyParser = require('body-parser')

exports.jsonParser = bodyParser.json()

exports.multiPartParser = bodyParser.urlencoded({ extended: true })
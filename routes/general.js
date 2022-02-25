var express = require('express')
const { getCurrencies } = require('../src/controller/currency/user')

const { downloadProof } = require('../src/controller/transaction/admin')

const generalRoute = express.Router()



//currencies
generalRoute.get('/currency/', getCurrencies)


generalRoute.get('/transaction/:id/proof', downloadProof)

//

module.exports = generalRoute
var express = require('express')

const { jsonParser } = require('../config/parser')
const { createPaymentAccount } = require('../src/controller/account/admin')
const { createAccount, getUserAccount } = require('../src/controller/account/user')
const { createCurrency, updateCurrency } = require('../src/controller/currency/admin')
const { updateTransactionStatus, getAllTransactions, getSingle, downloadProof, getTotalStats, getAllTransactionStats } = require('../src/controller/transaction/admin')
const { getAllUser } = require('../src/controller/users/admin')
const { updateWalletDepositStatus, updateWalletWithdrawStatus, getAllDepositStats } = require('../src/controller/wallet/admin')

const adminRoute = express.Router()

//accounts
adminRoute.post('/account/payment', jsonParser, createPaymentAccount)


adminRoute.get('/account', jsonParser, getUserAccount)
adminRoute.post('/account', jsonParser, createAccount)
//userRoute.put('/account/:id', jsonParser, getAll)

//accounts
adminRoute.post('/currency', jsonParser, createCurrency)
adminRoute.put('/currency/:id', jsonParser, updateCurrency)
//userRoute.put('/account/:id', jsonParser, getAll)

//transactions
adminRoute.get('/transaction/stats/',getAllTransactionStats )
adminRoute.get('/transaction/stats/total', getTotalStats)
adminRoute.get('/transaction/:id', getSingle)
adminRoute.put('/transaction/:id', jsonParser, updateTransactionStatus)
adminRoute.get('/transaction/:id/proof', downloadProof)
adminRoute.get('/transaction/', getAllTransactions)

//wallet
adminRoute.get('/wallet/stats/deposit', getAllDepositStats)
adminRoute.get('/wallet/:id', getSingle)
adminRoute.put('/wallet/deposit/:id', jsonParser, updateWalletDepositStatus)
adminRoute.put('/wallet/withdraw/:id', jsonParser, updateWalletWithdrawStatus)
adminRoute.get('/wallet/', getAllTransactions)

//users
adminRoute.get('/users', jsonParser, getAllUser)


//

module.exports = adminRoute
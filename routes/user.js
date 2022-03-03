var express = require('express')
const { transactionUpload, profileUpload } = require('../config/file')
const { jsonParser, multiPartParser } = require('../config/parser')
const { createAccount, getUserAccount, deleteAccount, getPaymentAccount } = require('../src/controller/account/user')
const { getUserTransactions, createTransactions } = require('../src/controller/transaction/user')
const { updateUserProfile, getUserProfile } = require('../src/controller/users/profile')
const { getUserWallet, createWallet, createWalletTransfer, depositToWallet, withdrawFromWallet, depositFlutterToWallet, getWalletFlutterDeposit } = require('../src/controller/wallet/user')
const { getWalletWithdrawal } = require('../src/controller/wallet/withdraw')

const userRoute = express.Router()

//accounts
userRoute.get('/account/payment', jsonParser, getPaymentAccount)


userRoute.get('/account', jsonParser, getUserAccount)
userRoute.post('/account', jsonParser, createAccount)
userRoute.delete('/account/:id', deleteAccount)
//userRoute.put('/account/:id', jsonParser, getAll)




//profile 
userRoute.put('/profile', jsonParser, profileUpload.single('avatar'), updateUserProfile)
userRoute.get('/profile', jsonParser, getUserProfile)




//wallet 
userRoute.post('/wallet', jsonParser, createWallet)
userRoute.get('/wallet', getUserWallet)

userRoute.post('/wallet/transfer', jsonParser, createWalletTransfer)

userRoute.post('/wallet/deposit', multiPartParser, transactionUpload.single('proof'), depositToWallet)
userRoute.post('/wallet/deposit/flutterwave', jsonParser, depositFlutterToWallet)
userRoute.get('/wallet/deposit/flutterwave', getWalletFlutterDeposit)

userRoute.post('/wallet/withdraw', jsonParser, withdrawFromWallet)
userRoute.get('/wallet/withdraw', getWalletWithdrawal)




//transactions
userRoute.post('/transaction', multiPartParser, transactionUpload.single('proof'), createTransactions)
userRoute.get('/transaction', jsonParser, getUserTransactions)


//

module.exports = userRoute
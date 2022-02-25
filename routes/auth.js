var express = require('express')
const { jsonParser, multiPartParser } = require('../config/parser')
const { signUp, login, logOut, getNewToken, forgotPassword, resetPassword } = require('../src/controller/users/auth')
const { isAuthenticated } = require('../src/mixin/permissions')

const authRoute = express.Router()

authRoute.post('/signup', jsonParser, signUp)
authRoute.post('/login', jsonParser, login)
authRoute.post('/logout', jsonParser, isAuthenticated, logOut)
authRoute.post('/refresh', jsonParser, getNewToken)
authRoute.post('/forgotpassword', jsonParser, forgotPassword)
authRoute.post('/resetpassword', jsonParser, resetPassword)

module.exports = authRoute
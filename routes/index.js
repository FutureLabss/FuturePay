var express = require('express')
const { isAuthenticated, isAdmin } = require('../src/mixin/permissions')
const adminRoute = require('./admin')
const authRoute = require('./auth')
const generalRoute = require('./general')
const userRoute = require("./user")

const routes = express.Router()

routes.use('/user', isAuthenticated, userRoute)
routes.use('/auth', authRoute)
routes.use('/admin', isAuthenticated, isAdmin, adminRoute)
routes.use('/', generalRoute)

routes.use('*',(req,res)=>{
  return res.status(400).json({error:'invalid url'})
})

module.exports = routes
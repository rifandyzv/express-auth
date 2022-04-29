const express = require('express')
const authRouter = express.Router()
const { signIn } = require('./authHandler')

authRouter.post('/signin', signIn)

module.exports = authRouter

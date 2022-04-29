const express = require('express')
const {
  getUserHandler,
  getUserByIdHandler,
  updateUserHandler,
  signUp
} = require('./userHandler')
userRouter = express.Router()

const {} = require('./userHandler')

userRouter.get('/', getUserHandler)
userRouter.get('/:id', getUserByIdHandler)
userRouter.post('/signup', signUp)
userRouter.put('/:id', updateUserHandler)

module.exports = userRouter

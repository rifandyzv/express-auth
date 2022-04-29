const express = require('express')
const { verifyJWT } = require('./authHandler')
const {
  getUserHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteHandler,
  signUp,
  getAuthorizedUserHandler
} = require('./userHandler')
userRouter = express.Router()

const {} = require('./userHandler')

userRouter.get('/', verifyJWT, getUserHandler)
userRouter.get('/:id', verifyJWT, getUserByIdHandler)
userRouter.get('/profile/me', verifyJWT, getAuthorizedUserHandler)
userRouter.post('/', verifyJWT, signUp)
userRouter.put('/:id', verifyJWT, updateUserHandler)
userRouter.delete('/:id', verifyJWT, deleteHandler)
module.exports = userRouter

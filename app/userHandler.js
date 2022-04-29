const express = require('express')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const { validRoles, checkUserRequest } = require('./authHandler')

const getUserHandler = async (req, res) => {
  try {
    if (req.user.role != 'admin') {
      return res.status(401).json({ message: 'unauthorized role' })
    }
    const allUser = await User.find()
    res.status(200).json(allUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getUserByIdHandler = async (req, res) => {
  try {
    if (req.user.role != 'admin') {
      return res.status(401).json({ message: 'unauthorized role' })
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      throw new Error('user not found!')
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

const updateUserHandler = async (req, res) => {
  try {
    if (req.user.role != 'admin') {
      return res.status(401).json({ message: 'unauthorized role' })
    }
    const id = req.params.id
    const username = req.body.username
    const password = req.body.password
    const role = req.body.role

    if (username) {
      const availableUser = await User.findOne({ username: username })
      if (availableUser) {
        throw new Error('Username already exist!')
      }
    }
    if (password) {
      if (password.length < 5) {
        throw new Error('Password to Short!')
      }
      req.body.password = await bcrypt.hash(password, 10)
    }
    if (role) {
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role!')
      }
    }
    const updatedUer = await User.findByIdAndUpdate(id, req.body)
    res.status(200).json({
      status: 'user updated',
      id: updatedUer.id
    })
    // } else {
    //   throw new Error('Input your username and password!')
    // }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const deleteHandler = async (req, res) => {
  try {
    if (req.user.role != 'admin') {
      return res.status(401).json({ message: 'unauthorized role' })
    }
    const deletedUser = await User.findByIdAndRemove(req.params.id)
    res.status(200).json({ status: 'user deleted', user: deletedUser })
  } catch (err) {}
}
const signUp = async (req, res) => {
  try {
    if (req.user.role != 'admin') {
      return res.status(401).json({ message: 'unauthorized role' })
    }
    const username = req.body.username
    const password = req.body.password
    const role = req.body.role

    if (username && password) {
      const availableUser = await User.findOne({ username: username })
      if (availableUser) {
        throw new Error('Username unavailable')
      }
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role!')
      }
      if (password.length < 5) {
        throw new Error('Password to Short!')
      }
      encrpytedPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
        username: username,
        password: encrpytedPassword,
        role: role
      })

      const savedUser = await newUser.save()
      res.status(200).json({
        status: 'sign up succes',
        user: savedUser
      })
    } else {
      throw new Error('Input your username and password!')
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getAuthorizedUserHandler = async (req, res) => {
  try {
    const userId = req.user.id
    if (!userId) {
      throw new Error('invalid Token!')
    }
    const userData = await User.findById(userId)

    res.status(200).json(userData)
  } catch (err) {}
}

module.exports = {
  getUserHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteHandler,
  signUp,
  getAuthorizedUserHandler
}

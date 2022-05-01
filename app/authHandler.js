const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const validRoles = ['user', 'admin']

const signIn = async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({ username: username })
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!user) {
      throw new Error('Username not found. Please sign up!')
    }
    if (checkPassword) {
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400
        }
      )
      return res.status(200).json({ token: token })
    } else {
      throw new Error('Invalid credentials!')
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: err.message })
  }
}

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'invalid credentials!' })
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).json({message: "no authorization!"})
  }
}

module.exports = { signIn, verifyJWT, validRoles }

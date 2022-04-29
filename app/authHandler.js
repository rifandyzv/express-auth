const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validRoles = ['user', 'admin']

// const signUp = async (req, res) => {
//   try {
//     const username = req.body.username
//     const password = req.body.password
//     const role = req.body.role

//     if (username && password) {
//       const availableUser = await User.findOne({ username: username })
//       if (availableUser) {
//         throw new Error('Username unavailable')
//       }
//       if (!validRoles.includes(role)) {
//         throw new Error('Invalid role!')
//       }
//       if (password.length < 5) {
//         throw new Error('Password to Short!')
//       }
//       encrpytedPassword = await bcrypt.hash(password, 10)

//       const newUser = new User({
//         username: username,
//         password: encrpytedPassword,
//         role: role
//       })

//       const savedUser = await newUser.save()
//       res.status(200).json({
//         status: 'sign up succes',
//         user: savedUser
//       })
//     } else {
//       throw new Error('Input your username and password!')
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// }

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
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400
        }
      )
      return res.status(200).json({ user, token: token })
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
    res.status(401)
  }
}

module.exports = { signIn, verifyJWT, validRoles }

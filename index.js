require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./app/authRouter')
const userRouter = require('./app/userRouter')
const User = require('./models/users')
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors())

const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to mongodb')
    User.estimatedDocumentCount(async (err, count) => {
      if (err) {
        console.log(err)
      } else {
        if (count == 0) {
          new User({
            username: 'admin',
            password: await bcrypt.hash('admin', 10),
            role: 'admin'
          }).save()
          console.log('admin role created')
          new User({
            username: 'john',
            password: await bcrypt.hash('password', 10),
            role: 'user'
          }).save()
          console.log('user role created')
        }
      }
    })
  })

app.listen(port, () => {
  console.log('server started at http://localhost:' + port)
})

app.use('/auth', authRouter)
app.use('/user', userRouter)

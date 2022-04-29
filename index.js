require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./app/authRouter')
const userRouter = require('./app/userRouter')
const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to mongodb')
  })

app.listen(port, () => {
  console.log('server started at http://localhost:' + port)
})

app.use('/auth', authRouter)
app.use('/user', userRouter)

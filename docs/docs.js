const express = require('express')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-docs.json')

const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('documentation can be viewed at http://localhost:' + port)
})
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

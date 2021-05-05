require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 1337

const middleware = require('./middleware/middleware')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes/routes')
const { resetFakerRequests } = require('./cron/resetFakerRequests')

app.use(express.json())
app.use(middleware.Logger)
app.use(routes)
app.use(errorHandler.ReturnError)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
  resetFakerRequests()
})

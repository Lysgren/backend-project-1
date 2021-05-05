const { HandleError, NoAuthorization, InvalidCredentials, InvalidToken, TooManyRequests, DatabaseError } = require('../error/errorHandler')
const { BaseError } = require('sequelize')

const ReturnError = (error, req, res, next) => {
  if (error instanceof HandleError) {
    res.status(error.statusCode).json({ error: error.message })

  } else if (error instanceof NoAuthorization) {
    res.status(error.statusCode).json({ error: error.message })

  } else if (error instanceof InvalidCredentials) {
    res.status(error.statusCode).json({ error: error.message })

  } else if (error instanceof BaseError) {
    res.status(error.statusCode).json({ error: error.message })

  } else if (error instanceof InvalidToken) {
    res.status(error.statusCode).json({ error: error.message })

  } else if (error instanceof TooManyRequests) {
    res.status(error.statusCode).json({ error: error.message }) 

  } else if (error instanceof DatabaseError) {
    res.status(error.statusCode).json({ error: error.message })

  } else {
    console.log(error.message)
    res.status(500).json({ error: 'The server is fucked up' })
  }
}

module.exports = {
  ReturnError
}
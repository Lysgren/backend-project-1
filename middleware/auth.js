require('dotenv').config()
const jwt = require('jsonwebtoken')
const { InvalidToken, NoAuthorization } = require('../error/errorHandler')

module.exports =  (req, res, next) => {
  try {
    const { authorization } = req.headers

    if ( !authorization ) {
      throw new NoAuthorization()
    }
  
    const token = authorization.replace('Bearer ', '')
    const { id, email } = jwt.verify(token, process.env.PASSWORD_ENCRYPTION)

    req.id = id
    req.email = email

  } catch (error) {
    if (error instanceof NoAuthorization) {
      throw new NoAuthorization()
    }

    throw new InvalidToken()
  }

  next()
}
class HandleError extends Error {}

class UnexpectedError extends HandleError {
  // 500 Server-error

  constructor() {
    super()
    this.message = 'An unexpected error happend! Kindly call you local pastor for an exorcism'
    this.statusCode = 500
  }
}

class InvalidBody extends HandleError {
  // 400 Bad Request
  
  constructor(fields) {
    super()
    this.fields = fields
    this.message = `Invalid body required fields: ${this.fields.join(', ')}`
    this.statusCode = 400
  }
}

class InvalidCredentials extends HandleError {
  // 403 Forbidden 

  constructor() {
    super()
    this.message = 'Invalid credentials'
    this.statusCode = 403
  }
}

class InvalidToken extends HandleError {
  // 403 Forbidden 

  constructor() {
    super()
    this.message = 'Invalid token'
    this.statusCode = 403
  }
}

class TooManyRequests extends HandleError {
  // 403 Forbidden 

  constructor() {
    super()
    this.message = 'Too many request made'
    this.statusCode = 403
  }
}

class DatabaseError extends HandleError {
  // 500 Server-error

  constructor() {
    super()
    this.message = 'Something unexpected happened to the database'
    this.statusCode = 500
  }
}

module.exports = {
  UnexpectedError,
  HandleError,
  InvalidBody,
  InvalidCredentials,
  InvalidToken,
  TooManyRequests,
  DatabaseError
}
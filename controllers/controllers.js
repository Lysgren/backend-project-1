const { InvalidBody } = require('../error/errorHandler')
const User = require('../models/user')

// Loggar in användaren genom att skicka tillbaka en JWT
const Login = async(req, res, next) => {
  try {
    const {email, password} = req.body

    if ( !email || !password ) {
      throw new InvalidBody(['email', 'password'])
    }
  
    const token = await User.authenticate(email, password)
    res.json({ message: 'Succesfully logged in', token: token })

  } catch (error) {
    next(error)
  }
}

// Ger tillbaka användarinfo för den inloggade användaren
const GetMe = (req, res, next) => {
  try {
    const { token } = req.body

    if ( !token ) {
      throw new InvalidBody(['token']) 
    }

    const userEmail = User.getUser(token)
    res.json({ email: userEmail })

  } catch (error) {
    next(error)
  }
}

// Ändrar lösenordet
const ChangePassword = async(req, res, next) => {
  try {
    const { newPassword, token } = req.body

    if ( !newPassword || !token ) {
      throw new InvalidBody(['password', 'token']) 
    }

    User.changePassword(token, newPassword)
    res.json({ message: 'Succesfully changed password'})

  } catch (error) {
    next(error)
  }
  
}

// Genererar en ny användarprofil, max 10st /dag per användare
const Generate = (req, res, next) => {
  try {
    const { token } = req.body

    if ( !token ) {
      throw new InvalidBody(['token'])
    }

    const fakedUser = User.generate(token)
    res.json({ fakedUser })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  Login,
  GetMe,
  ChangePassword,
  Generate
}
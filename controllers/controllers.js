const { InvalidBody } = require('../error/errorHandler')
const User = require('../models/user')

// Loggar in användaren genom att skicka tillbaka en JWT
const Login = async(req, res, next) => {
  try {
    const {email, password} = req.body

    if ( !email || !password ) {
      throw new InvalidBody(['email', 'password'])
    }
  
    const token = await User.login(email, password)
    res.json({ message: 'Succesfully logged in', token: token })

  } catch (error) {
    next(error)
  }
}

// Ger tillbaka användarinfo för den inloggade användaren
const GetMe = (req, res, next) => {
  try {
    res.json({ email: req.email })

  } catch (error) {
    next(error)
  }
}

// Ändrar lösenordet
const ChangePassword = async(req, res, next) => {
  try {
    const { newPassword } = req.body

    if ( !newPassword ) {
      throw new InvalidBody(['password']) 
    }

    User.changePassword(req.id, req.email, newPassword)
    res.json({ message: 'Succesfully changed password'})

  } catch (error) {
    next(error)
  }
}

// Genererar en ny användarprofil, max 10st /dag per användare
const Generate = async(req, res, next) => {
  try {
    const fakedUser = await User.generate(req.id, req.email)
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
const db = require('../database/connection')
const { DataTypes } = require('sequelize')
const faker = require('faker')
faker.locale = 'sv'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UnexpectedError, InvalidCredentials, InvalidToken, TooManyRequests, DatabaseError } = require('../error/errorHandler')

const User = db.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fakerRequests: {
    type: DataTypes.NUMBER
  }
})

User.beforeCreate((user, options) => {
  user.password = bcrypt.hashSync(user.password, 10)
})

User.decodeToken = token => {
  try {
    return jwt.verify(token, 'SUPER-DUPER-SECRET-STRING')
  } catch (error) {
    throw new InvalidToken()
  }
}

User.authenticate = async(email, password) => {
  const user = await User.findOne({ where: { email } })

  if (!user) { 
    throw new InvalidCredentials()
  }

  const match = bcrypt.compareSync(password, user.password)
  if (!match) { 
    throw new InvalidCredentials()
  }

  const id = user.id
  const userEmail = user.email

  const token = jwt.sign({ id, userEmail }, 'SUPER-DUPER-SECRET-STRING', { expiresIn: '7d' })
  return token
}

User.getUser = token => {
  try {
    const decoded = User.decodeToken(token)
    const { userEmail } = decoded
    return userEmail

  } catch (error) {
    if (error instanceof InvalidToken) {
      throw new InvalidToken()
    }
  
    throw new UnexpectedError()
  }
}

User.changePassword = (token, newPassword) => {
  try {
    const decoded = User.decodeToken(token)
    const { id, userEmail } = decoded

    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    console.log('Hashed password: ', hashedPassword)

    try {
      User.update({ password: hashedPassword }, {
        where: {
          id: id,
          email: userEmail
        }
      })
    } catch (error) {
      throw new DatabaseError()
    }

  } catch (error) {
    if (error instanceof InvalidToken) {
      throw new InvalidToken()
    } else if (error instanceof DatabaseError) {
      throw new DatabaseError()
    }
    
    throw new UnexpectedError()
  }
}

User.requestThrottling = async(id, userEmail) => {
  try {
    const requestsMade = await User.findOne({
      attributes: ['fakerRequests'],
      where: {
        id: id,
        email: userEmail
      }
    })

    const { fakerRequests } = requestsMade
    console.log(fakerRequests)


    if (fakerRequests >= 10) {
      throw new TooManyRequests()
    }

/*     User.update({ fakerRequests: 1 }, {
      where: {
        id: id,
        email: userEmail
      }
    }) */

  } catch (error) {
    throw new TooManyRequests()
  }
}

User.generate = async token => {
  try {
    const decoded =  User.decodeToken(token)
    const { id, userEmail } = decoded

    await User.requestThrottling(id, userEmail)

    let birthDate = faker.date.between('1950-01-01', '2000-01-01')
    let dateToStr = JSON.stringify(birthDate)
    dateToStr = dateToStr.slice(0, 11)
    dateToStr = dateToStr.slice(1)

    const fakedData = {
      name: faker.name.findName(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),  
        country: faker.address.country()
      },
      profession: faker.name.jobTitle(),
      dateOfBirth: dateToStr,
      home: faker.address.city(),
      skill: `${faker.name.jobType()} ${faker.music.genre()}`,
      picture: faker.image.image()
    }
    
    return fakedData

  } catch (error) {
    if (error instanceof InvalidToken) {
      throw new InvalidToken()
    } else if (error instanceof TooManyRequests) {
      throw new TooManyRequests()
    }
    
    throw new UnexpectedError()
  }
}

module.exports = User
require('dotenv').config()
const sequelize = require('sequelize')
const { DataTypes } = require('sequelize')
const db = require('../database/connection')
const faker = require('faker')
faker.locale = 'sv'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { InvalidCredentials, UnexpectedError, TooManyRequests, DatabaseError } = require('../error/errorHandler')

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

User.login = async(email, password) => {
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new InvalidCredentials
    }

    const hashedPassword =  bcrypt.compareSync(password, user.password)

    if (!hashedPassword) {
      throw new InvalidCredentials
    }

    return jwt.sign({ id: user.id, email: user.email }, process.env.PASSWORD_ENCRYPTION, { expiresIn:'7d' })

  } catch (error) {
    if (error instanceof InvalidCredentials) {
      throw new InvalidCredentials()
    }
  }
}

User.changePassword = (id, email, newPassword) => {
  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    try {
      User.update({ password: hashedPassword }, {
        where: {
          id: id,
          email: email
        }
      })
    } catch (error) {
      throw new DatabaseError()
    }

  } catch (error) {
    if (error instanceof DatabaseError) {
      throw new DatabaseError()
    }
    
    throw new UnexpectedError()
  }
}

User.requestThrottling = async(id, userEmail) => {
  const requestsMade = await User.findOne({
    attributes: ['fakerRequests'],
    where: {
      id: id,
      email: userEmail
    }
  })

  const { fakerRequests } = requestsMade

  if (fakerRequests >= 10) {
    throw new TooManyRequests()
  }

  User.update({ fakerRequests: fakerRequests + 1 }, {
    where: {
      id: id,
      email: userEmail
    }
  })
}

User.generate = async(id, email) => {
  try {
    await User.requestThrottling(id, email)

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
    if (error instanceof TooManyRequests) {
      throw new TooManyRequests()
    }
    
    throw new UnexpectedError()
  }
}

User.resetRequests = async() => {
  await User.update({ fakerRequests: 0 }, {
    where: {
      fakerRequests: {
        [sequelize.Op.not]: 0
      }
    }
  })
}

module.exports = User
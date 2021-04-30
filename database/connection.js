const { Sequelize } = require('sequelize')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database/fuskeluring.db'
})

module.exports = db
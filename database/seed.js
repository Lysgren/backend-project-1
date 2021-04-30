const db = require('./connection')
const User = require('../models/user.js')

db.sync()

const seedData = () => {
  User.create({ email: 'stabbing.steve@fuskeluring.hack', password: 'grillkorv123', fakerRequests: 10 })
  User.create({ email: 'murdering.mike@fuskeluring.hack', password: 'bananpaj1337', fakerRequests: 0 })
  User.create({ email: 'crimes.johnsson@fuskeluring.hack', password: 'sötsursås42', fakerRequests: 0 })
}

seedData()
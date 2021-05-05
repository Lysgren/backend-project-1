const User = require('../models/user')
const cron = require('node-cron')

const resetFakerRequests = () => {
 // Every minute * * * * *

cron.schedule('0 0 0 * * *', async () => {
    console.log('Reseting fakerRequests back to 0...')
    await User.resetRequests()
  })
}

module.exports = {
  resetFakerRequests
}
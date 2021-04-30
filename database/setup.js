const db = require('./connection')

// Setup för tabeler
// Seed för data

require ('../models/user')

db.sync()
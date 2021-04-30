const { Router } = require('express')
const router = new Router()

const controller = require('../controllers/controllers.js')
// const authenticate = require('../middleware/auth')

router.post('/login', controller.Login)
router.get('/me', controller.GetMe)
router.patch('/me', controller.ChangePassword)
router.get('/generate', controller.Generate)

module.exports = router
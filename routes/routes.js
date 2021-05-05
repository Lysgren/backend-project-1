const { Router } = require('express')
const router = new Router()

const controller = require('../controllers/controllers.js')
const authenticate = require('../middleware/auth')

router.post('/login', controller.Login)
router.get('/me', authenticate, controller.GetMe)
router.patch('/me', authenticate, controller.ChangePassword)
router.get('/generate', authenticate, controller.Generate)

module.exports = router
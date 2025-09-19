const express = require('express')

const { register, login, verifyOtp, setPassword } = require('../controllers/usercontrollers')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/set-password', setPassword)


module.exports= router;
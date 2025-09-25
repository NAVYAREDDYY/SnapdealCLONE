const express = require('express')
const { protect } = require('../middleware/authmiddleware');


const { register, login, verifyOtp, setPassword, resetPasswordLoggedIn } = require('../controllers/usercontrollers')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/set-password', setPassword)
router.put('/reset-password-loggedin', protect, resetPasswordLoggedIn);


module.exports= router;
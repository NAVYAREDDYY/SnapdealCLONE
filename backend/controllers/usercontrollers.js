const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Utility to send OTP (stub; integrate with SMS/Email provider)
async function sendOtpToDestination(destination, otp) {
  // eslint-disable-next-line no-console
  console.log('OTP for', destination, '=>', otp);
}

function isValidMobile(m) {
  return /^\d{10}$/.test(String(m || ''));
}
function isValidEmail(e) {
  return /.+@.+\..+/.test(String(e || ''));
}

// POST /register
const register = async (req, res) => {
  const { username, email, mobile, password } = req.body;
  try {
    if (!username || !password || (!email && !mobile)) {
      return res.status(400).json({ message: 'username, password and email or mobile are required' });
    }
    if (mobile && !isValidMobile(mobile)) {
      return res.status(400).json({ message: 'Mobile must be exactly 10 digits' });
    }
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const existing = await User.findOne({ $or: [ { email }, { mobile } ] });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, mobile, password: hashed, isVerified: true });
    await user.save();
    const role = user.role || 'user'; // remove isAdmin
    const token = jwt.sign({ id: user._id, role }, process.env.JWTSECRET, { expiresIn: '12h' });
    res.status(201).json({ message: 'Registration Successful', token, user: { id: user._id, username: user.username, email: user.email, mobile: user.mobile, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /login
const login = async (req, res) => {
  const { identifier, password, mode } = req.body; // mode: 'otp' | 'password'
  try {
    if (!identifier) return res.status(400).json({ message: 'identifier is required' });
    const identifierIsEmail = isValidEmail(identifier);
    const identifierIsMobile = isValidMobile(identifier);
    if (!identifierIsEmail && !identifierIsMobile) {
      return res.status(400).json({ message: 'Provide valid email or 10-digit mobile' });
    }

    let user = await User.findOne({ $or: [ { email: identifier }, { mobile: identifier } ] });

    if (mode === 'otp') {
      if (!user) {
        // Create minimal user to persist OTP
        user = new User({
          username: identifierIsEmail ? identifier.split('@')[0] : `user_${identifier.slice(-4)}`,
          email: identifierIsEmail ? identifier : undefined,
          mobile: identifierIsMobile ? identifier : undefined,
          isVerified: false
        });
      }
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();
      await sendOtpToDestination(identifier, otp);
      return res.status(200).json({ requiresOtp: true, message: 'OTP sent' });
    }

    // Default to password mode
    if (!user) return res.status(400).json({ message: 'Account Not Found' });
    if (!user.password) return res.status(400).json({ message: 'Password not set. Use OTP login.' });
    const ok = await bcrypt.compare(password || '', user.password || '');
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const role = user.role || 'user'; // remove isAdmin

    const token = jwt.sign({ id: user._id, role }, process.env.JWTSECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, mobile: user.mobile, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /verify-otp
const verifyOtp = async (req, res) => {
  const { identifier, otp } = req.body; // identifier email or mobile
  try {
    const identifierIsEmail = isValidEmail(identifier);
    const identifierIsMobile = isValidMobile(identifier);
    if (!identifierIsEmail && !identifierIsMobile) {
      return res.status(400).json({ message: 'Provide valid email or 10-digit mobile' });
    }
    let user = await User.findOne({ $or: [ { email: identifier }, { mobile: identifier } ] });
    if (!user) return res.status(400).json({ message: 'OTP not initiated. Please request OTP first.' });
    const valid = user.otp && user.otp === otp && user.otpExpiry && user.otpExpiry > new Date();
    if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });
    user.isVerified = true;
    await user.save();
    const role = user.role || 'user'; // remove isAdmin
 const token = jwt.sign({ id: user._id, role }, process.env.JWTSECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, mobile: user.mobile, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /set-password
const setPassword = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, verifyOtp, setPassword };
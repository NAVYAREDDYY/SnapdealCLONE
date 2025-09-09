const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {
    console.log("Authorization header received:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    console.log("Decoded token:", decoded);
    req.user = { _id: decoded.id, isAdmin: decoded.isAdmin };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, adminOnly };

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Vendor = require("../models/Vendor");

const protect = async (req, res, next) => {
  try {
    console.log("[Auth] Request path:", req.path);
    console.log("[Auth] Request method:", req.method);
    console.log("[Auth] Headers received:", req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("[Auth] No authorization header found");
      return res.status(401).json({ message: "Not authorized, no authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("[Auth] No token found in authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    console.log("[Auth] Token received:", token.substring(0, 10) + "...");
    
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    console.log("[Auth] Decoded token:", {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
      iat: decoded.iat,
      exp: decoded.exp
    });

    if (!decoded.id) {
      console.log("[Auth] No user ID in token");
      return res.status(401).json({ message: "Invalid token format" });
    }

    req.user = { _id: decoded.id, isAdmin: decoded.isAdmin, role: decoded.role };
    console.log("[Auth] User authorized:", req.user);
    next();
  } catch (error) {
    console.error("[Auth] Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed", error: error.message });
  }
};

const adminOnly = (req, res, next) => {
  console.log("[AdminAuth] Checking admin status for user:", req.user);
  
  if (!req.user) {
    console.log("[AdminAuth] No user object found");
    return res.status(403).json({ message: "Not authenticated" });
  }

  if (!req.user.isAdmin) {
    console.log("[AdminAuth] User is not admin:", req.user);
    return res.status(403).json({ message: "Admin access only" });
  }

  console.log("[AdminAuth] Admin access granted for user:", req.user._id);
  next();
};

module.exports = { protect, adminOnly };

// Middleware to allow only vendors
const vendorOnly = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Vendor access only' });
    }
    // Ensure vendor exists
    const vendor = await Vendor.findById(req.user._id).select('_id');
    if (!vendor) return res.status(403).json({ message: 'Vendor not found' });
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports.vendorOnly = vendorOnly;

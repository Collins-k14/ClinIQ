const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: 'No token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'Token is valid but user no longer exists'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'This account has been deactivated'
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: error.message === 'jwt expired' ? 'Token expired' : 'Invalid token'
    });
  }
};

// Middleware to restrict access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
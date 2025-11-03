const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to verify Clerk JWT
exports.requireAuth = ClerkExpressRequireAuth({
  // This will automatically verify the Clerk JWT
  onError: (error) => {
    console.error('Clerk auth error:', error);
  }
});

// Middleware to get user info from Clerk
exports.getUserInfo = async (req, res, next) => {
  try {
    // req.auth is populated by ClerkExpressRequireAuth
     if (req.auth && req.auth.session && req.auth.session.userId) {
      req.userId = req.auth.session.userId;
      next();
    } else if (req.auth && req.auth.userId) {
      req.userId = req.auth.userId;
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized', message: 'No valid user ID found' });
    }
  } catch (error) {
    console.error('Get user info error:', error);
    return res.status(401).json({ error: 'Unauthorized', message: error.message });
  }
};

// backend/middleware/roleMiddleware.js
const authorize = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
  }
  next();
};

module.exports = authorize; 
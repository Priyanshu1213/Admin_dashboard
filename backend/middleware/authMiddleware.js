const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

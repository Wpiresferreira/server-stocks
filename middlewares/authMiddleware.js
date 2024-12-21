import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Middleware to verify if a user is authenticated
export function authenticateToken (req, res, next){
  const token = req.cookies.token;

  // If no token is provided, return unauthorized error
  if (!token) {
    console.log('No token received')
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the token using the secret key
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(204).json({ error: 'Invalid token' }); // If invalid, send error
    console.log('User Authenticated')
    req.user = user;                       // Attach the user information to the request object
    next();                                // Move to the next middleware or route handler
  });
};

export function authenticateAdmin(req, res, next) {
  const token = req.cookies.token;

  // If no token is provided, return unauthorized error
  if (!token) {
    console.log('No token received')
    return res.status(204).json({ error: 'Unauthorized' });
  }

  // Verify the token using the secret key
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(204).json({ error: 'Invalid token' }); // If invalid, send error
    if(user.isAdmin){
      console.log('Admin Authenticated')
    }
    req.user = user;                       // Attach the user information to the request object
    next();                                // Move to the next middleware or route handler
  });
};

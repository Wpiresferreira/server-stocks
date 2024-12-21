import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Function to generate a JWT token for the authenticated user
const generateToken = (user) => {
  // Create a token payload using user information
  return jwt.sign(
    { 
      email : user.email
    },
    config.jwtSecret,                        // Sign the token with the secret key
    { expiresIn: config.jwtExpiresIn }       // Set token expiration time
  );
};

export default generateToken;

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the 'Authorization' header
  
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token,'ykjdsivjnsnvhjcsbnvhjscbivnsxkjvnxkjcvnskjxjnvkjxncvkjnkjvncxnv', (err, user) => { // Replace 'your_jwt_secret' with your actual JWT secret
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = user; // Attach the user data to the request object
    next(); // Proceed to the next middleware or controller
  });
};

module.exports = authenticateToken;

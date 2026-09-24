const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.pem'), 'utf8');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_PRIVATE_KEY, { algorithm: 'HS256', expiresIn: '7d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_PRIVATE_KEY, { algorithms: ['HS256'] });
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
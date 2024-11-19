const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json('Token Is Required');
  }
  const token = authHeader.split(' ')[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (eror) {
    const error = appError.create('Invalid Token', 401, httpStatusText.ERORR);
    return next(error);
  }
};

module.exports = verifyToken;

const jsonwebtoken = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

const { NOT_AUTHORIZED } = require('../constants/text');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1]; /* Bearer <token> */
    if (!token) {
      return res.status(401).json({ message: NOT_AUTHORIZED });
    }

    const decoded = jsonwebtoken.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: NOT_AUTHORIZED });
  }
};

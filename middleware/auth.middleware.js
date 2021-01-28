const jwtLib = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1]; /* Bearer <token> */
    if (!token) {
      return res.status(401).json({ message: 'Не автороизован' });
    }

    const decoded = jwtLib.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Не автороизован' });
  }
};

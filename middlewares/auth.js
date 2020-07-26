const jwt = require('jsonwebtoken');
const Constants = require('../util/constants');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(403).redirect('/login');

  jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).render('errors/403', { layout: false });

    return next();
  });
}
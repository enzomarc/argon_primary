const jwt = require('jsonwebtoken');
const Constants = require('../util/constants');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(403).json({ message: "Vous n'avez pas les autorisations nécessaires pour effectuer cette action." });

  jwt.verify(token, Constants.TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Vous n'avez pas les autorisations nécessaires pour effectuer cette action." });

    return next();
  });
}
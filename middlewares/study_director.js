const request = require('request');

module.exports = (req, res, next) => {
  if (req.session.user && req.cookies.access_token) {
    const user = req.session.user;

    if (user.type == "Directeur des études")
      return next();

    return res.status(403).render('errors/403', { layout: false });
  } else {
    req.session.destroy();
    res.clearCookie('access_token');
    return res.status(401).redirect('/login');
  }
}
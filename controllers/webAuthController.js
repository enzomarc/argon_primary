const request = require('request');
const app = require('../app');

// Web client login route
exports.login = (req, res) => {
  const token = req.params.token;

  request.get('http://localhost:3000/api/auth/verify/' + token, (error, response, body) => {
    if (error) {
      console.error(error);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Une erreur est survenue lors de la connexion.", error: error });
    }

    if (response.statusCode == 200) {
      req.session.user = JSON.parse(body).user;
      res.cookie('access_token', token);

      req.session.save();
      return res.json({ message: 'success' });
    } else {
      console.log(response);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Une erreur est survenue lors de la connexion.", error: error });
    }
  });
}

exports.page = (req, res) => {
  if (req.session.user && req.cookies.access_token) {
    return res.redirect('/');
  } else {
    return res.render('login', { layout: false });
  }
}
const jwt = require('jsonwebtoken');
const { User, Staff } = require('../models/index');
const Constants = require('../util/constants');

// API Auth Route
exports.auth = async (req, res) => {
  const credentials = { phone: req.body.phone, password: req.body.password };

  await User.findOne({ where: { phone: credentials.phone }, include: 'Staff' })
    .then((user) => {
      if (user == null)
        return res.status(401).json({ message: "Numéro de téléphone ou mot de passe incorrect." });

      if (!user.active)
        return res.status(401).json({ message: "Impossible de vous connecter, votre compte utilisateur est désactivé." });

      if (!user.validPassword(credentials.password)) {
        return res.status(401).json({ message: "Numéro de téléphone ou mot de passe incorrect." });
      }
      else {
        const payload = { id: user.id, phone: user.phone, first_name: user.Staff.first_name, last_name: user.Staff.last_name, type: user.type, avatar: user.Staff.avatar };
        const token = jwt.sign(payload, Constants.TOKEN_SECRET, { expiresIn: '3 hours' });

        return res.json({ access_token: token, user: payload });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).json({ message: "Une erreur est survenue lors de la connexion.", error: err });
    });
}

exports.verify = async (req, res) => {
  const token = req.params.token;

  jwt.verify(token, Constants.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Le token émit est corrompu." });
    }

    await User.findOne({ where: { phone: decoded.phone }, include: 'Staff' })
      .then((user) => {
        if (user == null)
          return res.status(401).json({ message: "Impossible d'obtenir les informations de l'utilisateur connecté." });

        if (!user.active)
          return res.status(401).json({ message: "Impossible de vous connecter, votre compte utilisateur est désactivé." });

        return res.json({ user: decoded });
      })
      .catch((err) => {
        return res.status(401).json({ message: "Une erreur est survenue lors de la connexion.", error: err });
      });
  });
}
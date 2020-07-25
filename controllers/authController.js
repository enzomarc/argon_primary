const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Constants = require('../util/constants');


exports.login = async (req, res) => {
    const credentials = { phone: req.body.phone };

    await User.findOne(credentials)
        .populate('staff')
        .exec(async (err, user) => {
            if (err)
                return res.status(401).json({ message: "Une erreur est survenue lors de la connexion." });

            if (user == null)
                return res.status(401).json({ message: "Numéro de téléphone ou mot de passe incorrect." });

            if (!user.active)
                return res.status(401).json({ message: "Impossible de vous connecter, votre compte utilisateur est désactivé." });

            await bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err)
                    return res.status(401).json({ message: "Une erreur est survenue lors de la connexion.", error: err });

                if (same) {
                    const data = { id: user._id, phone: user.phone, first_name: user.staff.first_name, last_name: user.staff.last_name };
                    const token = jwt.sign(data, Constants.TOKEN_SECRET, { expiresIn: '3 hours' });

                    return res.json({ acces_token: token });
                } else {
                    return res.status(401).json({ message: "Numéro de téléphone ou mot de passe incorrect." });
                }
            });
        });
}
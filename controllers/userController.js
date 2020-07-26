const bcrypt = require('bcrypt');
const { User, Staff } = require('../models/index');

exports.index = async (req, res) => {
  const error = req.flash('error');
  const info = req.flash('info');
  const success = req.flash('success');
  const _messages = {
    success: success,
    info: info,
    error: error
  };

  await User.findAll({ include: Staff })
    .then(async (users) => {
      const _populated = users.length > 0;

      // Get staff without user account
      const temp = await Staff.findAll();
      let _staff = [];

      temp.forEach(async (staff) => {
        await User.findOne({ where: { staff: staff.id } })
          .then((result) => {
            if (result == null)
              _staff.push(staff);
          })
          .catch((err) => console.error(err));
      });

      return res.render('users', { layout: 'main', title: 'Utilisateurs', staff: _staff, all: users, populated: _populated, messages: _messages });
    })
    .catch((err) => {
      console.error(err);
      req.flash('error', "Une erreur est survenue lors de la récupération de la liste des utilisateurs.");
      res.status(500);
    });
};

exports.show = async (req, res) => {

}

exports.store = async (req, res) => {
  const _staff = req.body.staff;

  await Staff.findOne({ where: { id: _staff } })
    .then(async (result) => {
      if (result != null) {
        let data = {
          staff: req.body.staff,
          phone: result.phone,
          type: result.type,
          active: true
        };

        // Hash account password
        await bcrypt.hash(req.body.password, bcrypt.genSaltSync(12), async (err, password) => {
          if (err) {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de la sécurisation du mot de passe utilisateur.");
            return res.status(500).redirect('/users');
          }

          data['password'] = password;

          await User.create(data)
            .then(() => {
              req.flash('success', "Le compte utilisateur a été ouvert avec succès. Le mot de passe a été envoyé par SMS au propriétaire du compte.");
              return res.status(201).redirect('/users');
            })
            .catch((err) => {
              console.error(err);
              req.flash('error', "Une erreur est survenue lors de la création du compte utilisateur. Veuillez contacter un administrateur.");
              return res.status(500).redirect('/users');
            })
        });
      } else {
        req.flash('error', "Impossible d'obtenir les informations du personnel sélectionné, il a propablement été supprimé. Veuillez contacter un administrateur.");
        return res.status(500).redirect('/users');
      }
    })
    .catch((err) => {
      console.error(err);
      req.flash('error', "Impossible d'obtenir les informations du personnel sélectionné. Veuillez contacter un administrateur.");
      return res.status(500).redirect('/users');
    });
}

exports.toggle = async (req, res) => {
  const user_id = req.params.id;

  await User.findOne({ where: { id: user_id } })
    .then((user) => {
      if (user != null) {
        user.active = !user.active;
        user.save();

        return res.json(user.active);
      } else {
        return res.status(500).json("Impossible de trouver le compte à modifier.");
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json("Impossible de modifier le statut du compte.");
    });
}

/**
 * Delete single user. 
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.id;

  // TODO: Delete user related
  await User.findOne({ where: { id: id } })
    .then(async (user) => {
      await user.destroy()
        .then(() => res.json({ message: "Le compte utilisateur a été supprimé avec succès." }));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json('Une erreur est survenue lors de la suppression du personnel.');
    });
};
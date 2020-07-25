const User = require('../models/user');
const Staff = require('../models/staff');
const bcrypt = require('bcrypt');

exports.index = async (req, res) => {
    const error = req.flash('error');
    const info = req.flash('info');
    const success = req.flash('success');
    const _messages = {
        success: success,
        info: info,
        error: error
    };

    await User.find()
        .populate('staff')
        .exec(async (err, users) => {
            if (err) {
                console.error(err);
                req.flash('error', "Une erreur est survenue lors de la récupération de la liste des utilisateurs.");
                res.status(500);
            }

            const _populated = users.length > 0;

            // Get staff without user account
            const temp = await Staff.find();
            let _staff = [];

            temp.forEach(async (staff) => {
                await User.findOne({ staff: staff._id }, (err, result) => {
                    if (result == null)
                        _staff.push(staff);
                });
            });

            return res.render('users', { layout: 'main', title: 'Utilisateurs', staff: _staff, all: users, populated: _populated, messages: _messages });
        });
};

exports.show = async (req, res) => {

}

exports.store = async (req, res) => {
    const _staff = req.body.staff;

    await Staff.findOne({ _id: _staff }, async (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', "Impossible d'obtenir les informations du personnel sélectionné. Veuillez contacter un administrateur.");
            return res.status(500).redirect('/users');
        }

        if (result != null) {
            let data = {
                staff: req.body.staff,
                phone: result.phone,
                type: result.type,
                active: true
            };

            // Encrypt account password
            await bcrypt.hash(req.body.password, bcrypt.genSaltSync(12), async (err, password) => {
                if (err) {
                    console.error(err);
                    req.flash('error', "Une erreur est survenue lors de la sécurisation du mot de passe utilisateur.");
                    return res.status(500).redirect('/users');
                }

                data['password'] = password;

                await User.create(data, (err, succ) => {
                    if (err) {
                        console.error(err);
                        req.flash('error', "Une erreur est survenue lors de la création du compte utilisateur. Veuillez contacter un administrateur.");
                        return res.status(500).redirect('/users');
                    }

                    req.flash('success', "Le compte utilisateur a été ouvert avec succès. Le mot de passe a été envoyé par SMS au propriétaire du compte.");
                    return res.status(201).redirect('/users');
                });
            });
        } else {
            req.flash('error', "Impossible d'obtenir les informations du personnel sélectionné, il a propablement été supprimé. Veuillez contacter un administrateur.");
            return res.status(500).redirect('/users');
        }
    });
}

exports.toggle = async (req, res) => {
    const user_id = req.params.id;
    const active = req.body.active;

    await User.findOneAndUpdate({ _id: user_id }, { active: active }, (err, doc) => {
        if (err)
            return res.status(500).json("Impossible de modifier le statut du compte.");

        return res.json(active);
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
    await User.findOneAndDelete({ _id: id }, (err, result) => {
        if (err) {
            console.log(err);
            req.flash('error', "Une erreur est survenue lors de la suppression du personnel.");
            res.status(500).redirect('/staff');
        }

        res.json({ message: "Le compte utilisateur a été supprimé avec succès." });
    });
};
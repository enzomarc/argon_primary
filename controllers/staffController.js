const Staff = require('../models/staff');
const User = require('../models/user');

/**
 * Show establishment staff list.
 * 
 * @param req 
 * @param res 
 */
exports.index = async (req, res) => {
    const error = req.flash('error');
    const info = req.flash('info');
    const success = req.flash('success');
    const _messages = {
        success: success,
        info: info,
        error: error
    };

    await Staff.find((err, staff) => {
        if (err) {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de la récupération de la liste du personnel.");
        }

        const _populated = staff.length > 0;
        res.render('staff', { layout: 'main', title: 'Personnel', all: staff, populated: _populated, messages: _messages });
    });
};

/**
 * Get single staff data.
 * 
 * @param req 
 * @param res 
 */
exports.show = async (req, res) => {
    const id = req.params.id;

    await Staff.findOne({ _id: id }, (err, staff) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Impossible de récupérer les informations du personnel.');
        }

        return res.json(staff);
    });
};

/**
 * Store a newly created staff into the database.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    await Staff.findOne({ phone: req.body.phone }, async (err, result) => {
        if (result != null) {
            req.flash('error', "Un personnel avec les mêmes informations existe déja.");
            return res.redirect('/staff');
        } else {
            await Staff.create(req.body, (err, result) => {
                if (err) {
                    console.error(err);
                    req.flash('error', "Une erreur est survenue lors de l'ajout du personnel.");
                    return res.status(500).redirect('/staff');
                }

                req.flash('success', "Personnel ajouté avec succès.");
                res.redirect('/staff');
            });
        }
    });
};

/**
 * Update single staff.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
    const id = req.params.id;

    await Staff.findOneAndUpdate({ _id: id }, req.body, (err, result) => {
        if (err) {
            console.log(err);
            req.flash('error', "Une erreur est survenue lors de la mise à jour du personnel.");
            return res.status(500).redirect('/staff');
        }

        req.flash('success', "Le personnel a été modifié avec succès.");
        res.redirect('/staff');
    });
};

/**
 * Delete single staff. 
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    // TODO: Delete staff related
    await Staff.findOneAndDelete({ _id: id }, async (err, result) => {
        if (err) {
            console.log(err);
            req.flash('error', "Une erreur est survenue lors de la suppression du personnel.");
            return res.status(500).redirect('/staff');
        }

        // Delete staff user account
        await User.findOneAndDelete({ staff: id });

        res.json({ message: "Le personnel a été supprimé avec succès." });
    });
};
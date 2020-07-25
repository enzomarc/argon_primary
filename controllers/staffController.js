const db = require('../models/index');

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
    let _populated = false;
    let staff = [];
    const _messages = {
        success: success,
        info: info,
        error: error
    };

    await db.Staff.findAll()
        .then((result) => {
            staff = result;
            _populated = staff.length > 0;
        })
        .catch((err) => {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de la récupération de la liste du personnel.");
        });

    res.render('staff', { layout: 'main', title: 'Personnel', all: staff, populated: _populated, messages: _messages });
};

/**
 * Get single staff data.
 * 
 * @param req 
 * @param res 
 */
exports.show = async (req, res) => {
    const id = req.params.id;

    await db.Staff.findOne({ id: id })
        .then((staff) => {
            return res.json(staff);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json('Impossible de récupérer les informations du personnel.');
        });
};

/**
 * Store a newly created staff into the database.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    await db.Staff.findOne({ where: { phone: req.body.phone } })
        .then(async (result) => {
            if (result != null) {
                req.flash('error', "Un personnel avec les mêmes informations existe déja.");
                return res.redirect('/staff');
            } else {
                const staff = new db.Staff(req.body);
                await staff.save()
                    .then(() => {
                        req.flash('success', "Personnel ajouté avec succès.");
                        res.redirect('/staff');
                    })
                    .catch((err) => {
                        console.error(err);
                        req.flash('error', "Une erreur est survenue lors de l'ajout du personnel.");
                        return res.status(500).redirect('/staff');
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
    await db.Staff.findOne({ where: { id: id } })
        .then((staff) => {
            if (staff != null) {
                staff.save();
                // TODO: Check and continue here
            }
        })

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
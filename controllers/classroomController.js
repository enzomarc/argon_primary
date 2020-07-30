const { Classroom } = require('../models/index');

/**
 * Show all classrooms.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.index = async (req, res) => {
  const error = req.flash('error');
  const info = req.flash('info');
  const success = req.flash('success');
  let _populated = false;
  let classrooms = [];
  const _messages = {
    success: success,
    info: info,
    error: error
  };

  await Classroom.findAll()
    .then((result) => {
      classrooms = result;
      _populated = classrooms.length > 0;
    })
    .catch((err) => {
      console.error(err);
      req.flash('error', "Une erreur est survenue lors de la récupération de la liste du personnel.");
    });

  res.render('classrooms', { layout: 'main', title: 'Salles de classes', all: classrooms, populated: _populated, messages: _messages });
}

/**
 * Get classroom data.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.show = async (req, res) => {
  const classroom = req.params.id;

  await Classroom.findOne({ where: { id: classroom } })
    .then((doc) => res.json(doc))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Impossible d'obtenir les informations de la salle de classe." });
    })
}

/**
 * Create new classroom.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  await Classroom.findOne({ where: { label: req.body.label, cycle: req.body.cycle, level: req.body.level } })
    .then(async result => {
      if (result != null) {
        req.flash('error', "Une classe avec ces mêmes informations existe déjà.");
        return res.redirect('/classrooms');
      } else {
        const classroom = new Classroom(req.body);

        await classroom.save()
          .then(() => {
            req.flash('success', "La classe a été ajoutée avec succès.");
            res.status(201).redirect('/classrooms');
          })
          .catch((err) => {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de l'ajout de la classe.");
            return res.status(500).redirect('/classrooms');
          });
      }
    });
}

/**
 * Update the given classroom.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  const classroom = req.params.id;

  await Classroom.findOne({ where: { id: classroom } })
    .then(async (classroom) => {
      if (classroom != null) {
        await classroom.update(req.body, { where: { id: classroom } })
          .then(() => {
            req.flash('success', "La classe a été modifiée avec succès.");
            return res.redirect('/classrooms');
          })
          .catch((err) => {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de la modification de la classe.");
            return res.status(500).redirect('/classrooms');
          });
      }
    });
}

/**
 * Delete the given classroom.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  const classroom = req.params.id;

  await Classroom.destroy({ where: { id: classroom } })
    .then(() => {
      // TODO: Delete classroom related
      return res.json({ message: "La classe a été supprimée avec succès." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la classe." });
    });
}
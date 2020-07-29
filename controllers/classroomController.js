const { Classroom } = require('../models/index');

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
          })
      }
    })
}
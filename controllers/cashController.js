const { Cash } = require('../models/index');
const moment = require('moment');

exports.index = async (req, res) => {
  const error = req.flash('error');
  const info = req.flash('info');
  const success = req.flash('success');
  let _populated = false;
  let cashes = [];
  const _messages = {
    success: success,
    info: info,
    error: error
  };

  await Cash.findAll()
    .then((result) => {
      result.forEach(cash => {
        const delay = cash.delay;
        const date = moment(delay).format('YYYY/mm/dd').toString();
        console.log(date);
        cash.delay = date;
        cashes.push(cash);
      });

      _populated = cashes.length > 0;
    })
    .catch((err) => {
      console.error(err);
      req.flash('error', "Une erreur est survenue lors de la récupération de la liste des caisses.");
    });

  res.render('treasure/cashes', { layout: 'main', title: 'Caisses', all: cashes, populated: _populated, messages: _messages });
}

exports.show = async (req, res) => {
  const cash = req.params.id;

  await Cash.findOne({ where: { id: cash } })
    .then((doc) => { return res.json(doc) })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Impossible d'obtenir les informations de la caisse." });
    });
}

exports.store = async (req, res) => {
  const data = {
    name: req.body.name,
    amount: req.body.amount.split('.')[0],
    cycle: req.body.cycle,
    level: req.body['level[]'],
    mandatory: req.body.mandatory == '1',
    delay: req.body.delay
  };

  await Cash.findOne({ where: { name: data.name, cycle: data.cycle, level: data.level } })
    .then(async result => {
      if (result != null) {
        req.flash('error', "Une caisse avec ces mêmes informations existe déjà.");
        return res.redirect('/treasure/cash');
      } else {
        const cash = new Cash(data);

        await cash.save()
          .then(() => {
            req.flash('success', "La caisse a été ajoutée avec succès.");
            res.status(201).redirect('/treasure/cash');
          })
          .catch((err) => {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de l'ajout de la caisse.");
            return res.status(500).redirect('/treasure/cash');
          });
      }
    });
}

exports.update = async (req, res) => {
  const data = {
    name: req.body.name,
    amount: req.body.amount.split('.')[0],
    cycle: req.body.cycle,
    level: req.body['level[]'],
    mandatory: req.body.mandatory == '1',
    delay: req.body.delay
  };
  const cash = req.params.id;

  await Cash.findOne({ where: { id: cash } })
    .then(async (doc) => {
      if (doc != null) {
        await doc.update(data, { where: { id: cash } })
          .then(() => {
            req.flash('success', "La caisse a été modifiée avec succès.");
            return res.redirect('/treasure/cash');
          }).catch((err) => {
            console.error(err);
            req.flash('error', "Une erreur est survenue lors de la modification de la caisse.");
            return res.status(500).redirect('/treasure/cash');
          });
      }
    }).catch((err) => {
      console.error(err);
      req.flash('error', "Impossible de trouver la caisse à modifier.");
      return res.status(500).redirect('/treasure/cash');
    });
}

exports.delete = async (req, res) => {
  const cash = req.params.id;

  await Cash.destroy({ where: { id: cash } })
    .then(() => {
      // TODO: Delete cash related
      return res.json({ message: "La caisse a été supprimée avec succès." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la caisse." });
    });
}
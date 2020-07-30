const { Config } = require('../models/index');

/**
 * Update establishment settings.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
exports.update = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };

    await Config.count().then(async (count) => {
      if (count <= 0) {
        await Config.create(data)
          .then(() => {
            req.flash('success', "Les paramètres de l'établissement ont été enregistré avec succès.");
            res.status(201).redirect('/settings');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        const conf = await Config.findOne();

        await conf.update(data)
          .then(() => {
            req.flash('success', "Les paramètres de l'établissement ont été enregistré avec succès.");
            res.status(201).redirect('/settings');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  } catch (error) {
    console.error(error);
  }

  next();
}

/**
 * Show establishment settings page.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
exports.show = async (req, res, next) => {
  await Config.findOne()
    .then((conf) => {
      res.render('system/settings', { title: 'Paramétrage', config: conf });
    })
    .catch((err) => {
      req.flash('error', "Une erreur est survenue lors de l'obtention des paramètres de votre établissement.");
      console.error(err);
    });
}
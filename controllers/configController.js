const Config = require('../models/config');

/**
 * Update establishment settings.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
exports.update = async (req, res, next) => {
    try {
        const address = {
            country: req.body.country,
            region: req.body.region,
            department: req.body.department,
            borough: req.body.borough,
            city: req.body.city,
            postal_code: req.body.postal_code,
            core: req.body.core,
        };

        delete req.body.country;
        delete req.body.region;
        delete req.body.department;
        delete req.body.borough;
        delete req.body.city;
        delete req.body.postal_code;
        delete req.body.core;

        const data = {
            ...req.body,
            address: address,
        };

        await Config.count().then(async (count) => {
            if (count <= 0) {
                await Config.create(data)
                    .then(() => {
                        res.status(201).redirect('/settings');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                await Config.findOneAndUpdate(data)
                    .then(() => {
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
    await Config.findOne().then((conf) => {
        res.render('settings', { title: 'Paramétrage', config: conf, });
    });
}
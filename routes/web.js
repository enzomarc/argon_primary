const express = require('express');
const web = express.Router();

const configController = require('../controllers/configController');


// Routes
web.get('/', (req, res, next) => {
    res.render('index', { layout: 'main' });
});

web.get('/login', (req, res, next) => {
    res.render('login', { layout: false });
});

web.get('/settings', configController.show);

module.exports = web;
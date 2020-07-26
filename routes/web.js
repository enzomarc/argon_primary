const express = require('express');
const web = express.Router();

const configController = require('../controllers/configController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');


const authMiddleware = require('../middlewares/auth');


// Routes
web.get('/login', (req, res, next) => {
    res.render('login', { layout: false });
});

web.get('/', (req, res, next) => {
    res.render('index', { layout: 'main', title: 'Tableau de bord' });
});
web.get('/settings', configController.show);
web.get('/staff', staffController.index);
web.get('/users', userController.index);

module.exports = web;
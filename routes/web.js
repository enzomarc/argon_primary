const express = require('express');
const web = express.Router();

const configController = require('../controllers/configController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');
const authController = require('../controllers/webAuthController');


const authMiddleware = require('../middlewares/auth_web');


// Routes
web.get('/login', authController.page);

web.post('/login/:token', authController.login);

web.get('/', authMiddleware, (req, res, next) => {
  res.render('index', { layout: 'main', title: 'Tableau de bord' });
});

web.get('/settings', authMiddleware, configController.show);
web.get('/staff', authMiddleware, staffController.index);
web.get('/users', authMiddleware, userController.index);

module.exports = web;
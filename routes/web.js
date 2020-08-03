const express = require('express');
const web = express.Router();

const configController = require('../controllers/configController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');
const authController = require('../controllers/webAuthController');
const classroomController = require('../controllers/classroomController');
const cashController = require('../controllers/cashController');


// Middlewares
const authMiddleware = require('../middlewares/auth_web');
const studyDirector = require('../middlewares/study_director');
const scolarityMiddleware = require('../middlewares/scolarity');
const treasureMiddleware = require('../middlewares/treasure');


// Authentication
web.get('/login', authController.page);
web.get('/logout', authController.logout);
web.post('/login/:token', authController.login);

web.get('/', authMiddleware, (req, res, next) => {
  res.render('index', { layout: 'main', title: 'Tableau de bord' });
});

// System
web.get('/settings', authMiddleware, configController.show);
web.get('/staff', authMiddleware, staffController.index);
web.get('/users', authMiddleware, userController.index);


// Studies Director
web.get('/classrooms', authMiddleware, studyDirector, classroomController.index);


// Scolarity
web.get('/scolarity/classrooms', authMiddleware, scolarityMiddleware, classroomController.attributions);
web.get('/scolarity/students', authMiddleware, scolarityMiddleware, classroomController.attributions);


// Treasure
web.get('/treasure/cash', authMiddleware, treasureMiddleware, cashController.index);

module.exports = web;
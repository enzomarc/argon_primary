const express = require('express');
const bodyParser = require('body-parser');
const api = express.Router();

const configController = require('../controllers/configController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const classroomController = require('../controllers/classroomController');

const authMiddleware = require('../middlewares/auth');
const studyDirector = require('../middlewares/study_director');


// CORS Middleware
api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Parse request body
api.use(bodyParser.json({ strict: false }));
api.use(bodyParser.urlencoded({ extended: false }));

// Automatically set authorization header from session if user logged in
api.use((req, res, next) => {
  if (req.session.user && req.cookies.access_token) {
    const token = req.cookies.access_token;
    req.headers.authorization = token;
    res.setHeader('authorization', token);
  }

  next();
});


// Login routes
api.post('/auth', authController.auth);
api.get('/auth/verify/:token', authController.verify);

// Config routes
api.post('/config', authMiddleware, configController.update);

// Staff routes
api.post('/staff', authMiddleware, staffController.store);
api.get('/staff/:id', authMiddleware, staffController.show);
api.post('/staff/:id/update', authMiddleware, staffController.update);
api.get('/staff/:id/delete', authMiddleware, staffController.delete);

// User routes
api.post('/users', authMiddleware, userController.store);
api.post('/users/:id/toggle', authMiddleware, userController.toggle);
api.get('/users/:id/delete', authMiddleware, userController.delete);

// Classrooms routes
api.post('/classrooms', authMiddleware, studyDirector, classroomController.store);
api.get('/classrooms/:id', authMiddleware, studyDirector, classroomController.show);
api.post('/classrooms/:id/update', authMiddleware, studyDirector, classroomController.update);
api.get('/classrooms/:id/delete', authMiddleware, studyDirector, classroomController.delete);

module.exports = api;
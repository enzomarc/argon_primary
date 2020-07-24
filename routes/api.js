const express = require('express');
const bodyParser = require('body-parser');
const api = express.Router();

const configController = require('../controllers/configController');
const staffController = require('../controllers/staffController');
const userController = require('../controllers/userController');


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

// Config routes
api.post('/config', configController.update);

// Staff routes
api.post('/staff', staffController.store);
api.get('/staff/:id', staffController.show);
api.post('/staff/:id/update', staffController.update);
api.get('/staff/:id/delete', staffController.delete);

// User routes
api.post('/users', userController.store);
api.post('/users/:id/toggle', userController.toggle);
api.get('/users/:id/delete', userController.delete);

module.exports = api;
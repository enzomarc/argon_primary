const express = require('express');
const handle = require('handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const routes = require('./routes/web');
const apiRoutes = require('./routes/api');


mongoose.connect("mongodb://127.0.0.1:27017/argon", { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error(error);
    });

const app = express();

// View engine config
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({ layoutsDir: path.join(__dirname, '/views/layouts'), extname: 'hbs', handlebars: allowInsecurePrototypeAccess(handle), }));

// Serve static files
app.use(express.static('public'));

// Load routes
app.use(routes);
app.use('/api', apiRoutes);

module.exports = app;
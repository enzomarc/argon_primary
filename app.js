const express = require('express');
const handle = require('handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const { Sequelize } = require('sequelize');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const routes = require('./routes/web');
const apiRoutes = require('./routes/api');


const app = express();

app.use(cookieParser('special key'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());


// View engine config
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials'),
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handle),
    helpers: {
        inc: (value) => value + 1
    }
}));

// Serve static files
app.use(express.static('public'));

// Load routes
app.use(routes);
app.use('/api', apiRoutes);

// Errors pages
app.use((req, res) => {
    res.status(404);
    res.render('errors/404', { layout: false });
});

module.exports = app;
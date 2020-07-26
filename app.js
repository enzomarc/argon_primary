const express = require('express');
const handle = require('handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const { Sequelize } = require('sequelize');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Constants = require('./util/constants');

const routes = require('./routes/web');
const apiRoutes = require('./routes/api');
const user = require('./models/user');


const app = express();

app.use(cookieParser(Constants.SESSION_SECRET));
app.use(session({
    key: 'user_sid',
    secret: Constants.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { expires: new Date(Date.now() + (3600000 * 2)) }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// View engine config
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials'),
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handle),
    helpers: {
        inc: (value) => value + 1,
    }
}));

// Serve static files
app.use(express.static('public'));

// Check if user cookie exists while there's no user in session
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user)
        res.clearCookie('user_sid');

    next();
});

// Load routes
app.use(routes);
app.use('/api', apiRoutes);

// Errors pages
app.use((req, res) => {
    res.status(404);
    res.render('errors/404', { layout: false });
});

module.exports = app;
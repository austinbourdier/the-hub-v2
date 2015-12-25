var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var database = require('./config/database');
var routes = require('./routes/index');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var auth = require('./config/auth/init');
var swig = require('swig');
var multer = require('multer');
var http = require('http');
var port = process.env.PORT || '8888';
database.connect();
auth(passport);

var app = express();

// view engine setup
app.set('port', port);
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var sessionOpts = {
  saveUninitialized: true,
  resave: true,
  secret: process.env.sessionSecret || require('./config.js').get('session:secret'),
  cookie: {
    maxAge: new Date(Date.now() + 1209600000),
    expires: new Date(Date.now() + 1209600000)
  }
};

app.use(multer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://limitless-earth-7143.herokuapp.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
routes(app, passport);



/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get('port'));

module.exports = server;

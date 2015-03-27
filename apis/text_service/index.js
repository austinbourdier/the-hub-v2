
/**
 * Module dependencies.
 */
var logger = require('morgan')
,bodyParser = require('body-parser')
,express = require('express')
,routes = require('./routes')
,http = require('http')
;

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
// app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(app.router);

app.get('/1/texts', routes.index);

console.log("Starting text_service");
http.createServer(app);

exports.app = app;

module.exports = exports;

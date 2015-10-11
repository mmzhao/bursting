// server.js

// BASE SETUP
// =============================================================================
var express = require('express');
var app = express();
// var csrf = require('csurf');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var async = require('async');
var helmet = require('helmet');
var database = require('./config/database');
var productApi = require('./app/routes/productApi.js');
var ui = require('./app/routes/ui.js');
var port = process.env.PORT || 80; // setting port to run webserver on
mongoose.connect(database.getDatabaseUrl()); // connect to db


// CONFIGURATION ===============================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log all requests to the console
app.use(session({
  secret: "I'm secretly super spudy",
  cookie: {
    httpOnly: true,
    secure: true
  }
}));
app.use(helmet());
// app.use(csrf());
// var csrfProtection = csrf({ cookie: true });
// app.use(function(req, res, next) {
//   res.locals._csrf = req.csrfToken();
//   next();
// });

// ROUTES ======================================================================
app.use('/api', productApi);
app.use('/', ui);


// START THE SERVER
// =============================================================================
app.listen(port);
module.exports = app;
console.log('Utilities is running on port ' + port);

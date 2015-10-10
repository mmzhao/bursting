// app/routes/ui.js
// these routes are for displaying the UI
var express = require('express');
var ui = express.Router();

// UI ROUTES 
// =============================================================================
ui.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
  res.sendFile('./public/index.html');
});

// export routes
module.exports = ui;

// package all models together for easy api access
require('../models/Restroom');
require('../models/User');
require('../models/Rating');

var mongoose = require('mongoose');
var Restroom = mongoose.model('Restroom');
Restroom.schemaType = 'Restroom';
var User = mongoose.model('User');
User.schemaType = 'User';
var Rating = mongoose.model('Rating');
Rating.schemaType = 'Rating';

module.exports = {
  Restroom: Restroom,
  User: User,
  Rating: Rating
};
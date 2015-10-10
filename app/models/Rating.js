var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
  score: {type: Number, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  restroom: {type: Schema.Types.ObjectId, ref: 'Restroom'},
  description: {type: String}
});

mongoose.model('Rating', ratingSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restroomSchema = new Schema({
  lat: {type: Number, required: true},
  lng: {type: Number, required: true},
  name: {type: String, required: true},
  score: {type: Number},
  ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}]
});

mongoose.model('Restroom', restroomSchema);

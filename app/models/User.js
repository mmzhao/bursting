var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true},
  device_id: {type: String, required: true},
  ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}]
});

mongoose.model('User', userSchema);

// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LocationSchema = new Schema({
  idhome: String,
  latitude: Number,
  longitude: Number
});

LocationSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Location', LocationSchema);

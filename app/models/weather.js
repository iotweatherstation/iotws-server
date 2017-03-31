// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WeatherSchema = new Schema({
  idhome: String,
  temp: Number,
  humid: Number,
  timestamp: Date
});

WeatherSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Weather', WeatherSchema);

// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LastWeatherSchema = new Schema({
  idhome: String,
  latitude: Number,
  longitude: Number,
  temp: Number,
  humid: Number,
  timestamp: Date
});

LastWeatherSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('LastWeather', LastWeatherSchema);

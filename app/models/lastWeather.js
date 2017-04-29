// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LastWeatherSchema = new Schema({
  idhome: String,
  temp: Number,
  humid: Number,
  timestamp: Date
});

LastWeatherSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('LastWeather', LastWeatherSchema);

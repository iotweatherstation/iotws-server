// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PredictionSchema = new Schema({
  idhome: String,
  predtemp: Number,
  predhumid: Number,
  timestamp: Date
});

PredictionSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Prediction', PredictionSchema);

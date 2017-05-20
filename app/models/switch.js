// Switch model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SwitchSchema = new Schema({
  idhome: String,
  val: Number
});

SwitchSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Switch', SwitchSchema);

/**
 * Created by DELL-INSPIRON on 10/6/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
{
id:"vinh01"
pwd:"123456"
}
 */

var UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  pwd: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

var User = mongoose.model('user', UserSchema);

// make this available to our Node applications
module.exports = User;
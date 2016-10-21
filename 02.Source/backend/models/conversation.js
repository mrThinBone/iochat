/**
 * Created by DELL-INSPIRON on 10/6/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = ConversationSchema;
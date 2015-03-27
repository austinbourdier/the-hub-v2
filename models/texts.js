

var mongoose = require('mongoose');

var textSchema = new mongoose.Schema({
    recepient: {
      type: String
    },
    content: {
      type: String
    },
    senderID: {
      type: String
    },
    sentAt: {
      type: Date
    }
});

module.exports = mongoose.model('Text', textSchema);



var mongoose = require('mongoose');

var emailSchema = new mongoose.Schema({
    recepient: {
      type: String
    },
    content: {
      type: String
    },
    subject: {
      type: String
    },
    senderID: {
      type: String
    },
    sentAt: {
      type: Date
    }
});

module.exports = mongoose.model('Email', emailSchema);

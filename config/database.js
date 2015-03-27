var mongoose = require('mongoose');
var User = require('../models/user.js');

exports.connect = function() {
  mongoose.connect(process.env.mongoURI || require('../config.js').get('mongoURI'), function(err){
    if(err) console.log(err);
  });
  mongoose.connection.on('connected', function() {
    console.log("Mongo successfully connected at", process.env.mongoURI || require('../config.js').get('mongoURI'));
  });

  mongoose.connection.on('disconnected', function(){
    console.log('Mongo has disconnected');
  })
}

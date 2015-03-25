var mongoose = require('mongoose');
var User = require('../models/user.js');
var config = require('../config.js');

exports.connect = function() {
  mongoose.connect(config.get('uri'), function(err){
    if(err) console.log(err);
  });
  mongoose.connection.on('connected', function() {
    console.log("Mongo successfully connected at", config.get('uri'));
  });

  mongoose.connection.on('disconnected', function(){
    console.log('Mongo has disconnected');
  })
}

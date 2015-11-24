var mongoose = require('mongoose');

exports.connect = function() {
  mongoose.connect(process.env.mongoURI || require('../config.js').get('mongoURI'), function(err){
    console.log(err)
    if(err) throw err
    exports.connection = mongoose;
  });
  mongoose.connection.on('connected', function() {
    console.log("Mongo successfully connected at", process.env.mongoURI || require('../config.js').get('mongoURI'));
  });

  mongoose.connection.on('disconnected', function(){
    console.log('Mongo has disconnected');
  })
}

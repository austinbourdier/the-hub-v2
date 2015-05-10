var User = require('../models/user');
var Text = require('../models/texts');
var Email = require('../models/emails');
var async = require('async');


exports.getUserTextsAndEmails = function(req,res,next){
  async.waterfall([
    function(done){
      Text.find({ 'senderID' : req.session.user._id }, function(err, texts) {
        if(err) return done("Error querying for texts: " + err, null);
        done(null, {texts:texts});
      });
    },
    function(data, done){
      Email.find({ 'senderID' : req.session.user._id }, function(err, emails) {
        if(err) return done({error: "Error querying for emails: " + err});
        data.emails = emails;
        done(null, data);
      });
    }
  ],
  function(err, data){
    if(err) return res.send({err:err});
    res.json(data)
  })
};



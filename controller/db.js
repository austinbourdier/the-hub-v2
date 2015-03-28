var User = require('../models/user');
var async = require('async')
var request = require('request')
var apis = require('../apis')
// TODO: this should be two api calls, one for texts, one for emails
exports.getUserTextsAndEmails = function(req,res,next){
  async.waterfall([
    function(done){
      request({url:(process.env.text_service_url || require("../config.js").get('text_service').url) + '/1/texts',
      method: "GET",
      headers:{"x-apikey":process.env.textApiKey || require('../config.js').get('text_service:apikey')}, "x-user-id": req.session.user._id}, function (error, response, body) {
        if (error) return done('TEXT SERVICE ERROR: ' + error);
        console.log('yolo 1')
        done(null, {texts: []});
      })
    },
    function(data, done){
      console.log('yolo 1.5')
      request({url:(process.env.email_service_url || require("../config.js").get('email_service').url) + '/1/emails',
      method: "GET",
      headers:{"x-apikey":process.env.emailApiKey || require('../config.js').get('email_service:apikey')}, "x-user-id": req.session.user._id}, function (error, response, body) {
        if (error)    return done('EMAIL SERVICE ERROR: ' + error);
        data.emails =  [];
        console.log('yolo 2')

        done(null, data);
      })
    }
    ], function(err, data){
      if(err) return res.send({err:err});
              console.log('yolo 3')

      res.send(data)
    })
};



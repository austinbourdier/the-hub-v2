var User = require('../../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var FB = require('fb');
var request  = require("request")
module.exports = function(passport) {

  passport.use( new FacebookStrategy({
    clientID: process.env.facebookAppId || require('../../config.js').get('facebook:app_id'),
    clientSecret: process.env.facebookAppSecret || require('../../config.js').get('facebook:app_secret'),
    callbackURL: process.env.facebookAppCallback || require('../../config.js').get('facebook:app_callback'),
  },
    function(token, refreshToken, profile, callback) {
      process.nextTick(function() {
        FB.api('/me?fields=picture.type(large)&access_token=' + token, function(data) {
      // search for user in PG database, otherwise create new user. this user becomes the serialed req.user
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err) return callback(err);
          if (user){
            // update profile picture if they've changed it
            User.findOneAndUpdate(profile.id, {
              $set :{
                facebook: {
                  profPicture: data.picture.data.url
                }
              }
            },
            function(err, result){
              // TODO: err catch
              return callback(null, user);
            })
          } else {
            var newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook.id = profile.id;
            newUser.facebook.email = newUser.email;
            newUser.facebook.profPicture = data.picture.data.url;
            newUser.facebook.firstName = profile._json.first_name;
            newUser.facebook.lastName = profile._json.last_name;
            newUser.facebook.token = token;
            newUser.save(function(err, savedUser) {
              if(err) return callback(err);
              callback(null, savedUser);
            });
          }
        });
      });
    });
  }))
};

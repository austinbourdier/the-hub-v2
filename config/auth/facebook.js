var User = require('../../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config.js');

module.exports = function(passport) {

  passport.use( new FacebookStrategy({

    clientID: config.get('facebook:app_id'),
    clientSecret: config.get('facebook:app_secret'),
    callbackURL: config.get('facebook:app_callback'),
    },

  function(token, refreshToken, profile, callback) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err) return callback(err);
        console.log('profile', profile);
        if (user) return callback(null, user);
        console.log('user not found, creating user');
        var newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook.id = profile.id;
            newUser.facebook.email = newUser.email
            newUser.facebook.firstName = profile._json.first_name
            newUser.facebook.lastName = profile._json.lastame
            newUser.facebook.token = token;
            newUser.save(function(err, savedUser) {
              if(err) return callback(err);
              callback(null, savedUser);
            });
          })
      });
  }))
}

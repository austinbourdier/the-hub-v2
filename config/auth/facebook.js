var User = require('../../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config.js');
var FB = require('fb');

module.exports = function(passport) {

  passport.use( new FacebookStrategy({

    clientID: config.get('facebook:app_id'),
    clientSecret: config.get('facebook:app_secret'),
    callbackURL: config.get('facebook:app_callback'),
    },

  function(token, refreshToken, profile, callback) {
    process.nextTick(function() {
      FB.api('/me?fields=picture.type(large)&access_token=' + token, function(data) {
    // search for user in PG database, otherwise create new user. this user becomes the serialed req.user
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err) return callback(err);
        if (user) return callback(null, user);
        var newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook.id = profile.id;
            newUser.facebook.email = newUser.email
            newUser.facebook.profPicture = data.picture.data.url
            newUser.facebook.firstName = profile._json.first_name
            newUser.facebook.lastName = profile._json.last_name
            newUser.facebook.token = token;
            newUser.save(function(err, savedUser) {
              if(err) return callback(err);
              callback(null, savedUser);
            });
          })
        });
      });
  }))
};

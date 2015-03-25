
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

var toLower = function toLower (v) {
  return v.toLowerCase();
}

var userSchema = new mongoose.Schema({
    username: {
      type: String,
    },
    email: {
      type: String,
      set: toLower
    },
    password: {
      type: String
    },
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String,
    },
    createdAt: {
      type: Date,
      required: false
    },
    updatedAt: {
      type: Date,
      required: false
    }
});

userSchema.pre('save', function(callback) {
  var now = moment().utc();
  if(!this.createdAt) this.createdAt = now;
  this.updatedAt = now;

  if(this.password) {
    var _this = this;
    if (!_this.isModified('password')) return callback();
      bcrypt.genSalt(5, function(err, salt) {
      if (err) return callback(err);
        bcrypt.hash(_this.password, salt, null, function(err, hash) {
          if (err) return callback(err);
          _this.password = hash;
          return callback();
        });
      });
    }
  else {
    callback();
  }
});

userSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};


module.exports = mongoose.model('User', userSchema);

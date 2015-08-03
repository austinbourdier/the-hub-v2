exports.auth = require('./auth');
exports.db = require('./db');
exports.box = require('./box');
exports.dropbox = require('./dropbox');
exports.onedrive = require('./onedrive');
exports.uploader = require('./uploader');
exports.googledrive = require('./googledrive');


exports.render = function(req, res) {
  if(req.session.user) return res.render('index', {user: req.session.user});
  else res.render('login');
};

exports.sendBackUploadedFiles = function(req, res) {
  console.log('SEND BACK')
  console.log(req.session.user)
  res.send({user: req.session.user})
};




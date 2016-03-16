exports.auth = require('./auth');
exports.db = require('./db');
exports.box = require('./box');
exports.dropbox = require('./dropbox');
exports.onedrive = require('./onedrive');
exports.uploader = require('./uploader');
exports.googledrive = require('./googledrive');


exports.render = function(req, res) {
  if(req.session.user) return res.render('index', {justAdded:req.justAdded});
  else res.render('login');
};

exports.sendBackFiles = function(req, res) {
  res.send({user: req.session.user});
};

exports.user = function(req, res) {
  res.send({user: req.session.user});
};




exports.auth = require('./auth');
exports.db = require('./db');
exports.box = require('./box');
exports.dropbox = require('./dropbox');
exports.googledrive = require('./googledrive');


exports.render = function(req, res) {
  if(req.session.user) return res.render('index', {user: req.session.user});
  else res.render('login')
};


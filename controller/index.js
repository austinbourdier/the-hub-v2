exports.auth = require('./auth');
exports.db = require('./db');

exports.render = function(req, res, next) {
  res.render('index', {user: req.session.user})
};


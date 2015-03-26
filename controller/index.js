exports.auth = require('./auth');

exports.render = function(req, res, next) {
  res.render('home', {user: req.session.user})
};


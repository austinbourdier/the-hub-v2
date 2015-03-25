exports.facebookLogin = function(req, res, next) {

};
exports.renderDash = function(req, res, next) {
  if(!req.session.user) return res.redirect('/');
  res.render('dashboard')
}

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/')
}

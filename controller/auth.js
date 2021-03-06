exports.requireLoggedIn = function(req,res,next){
  if(!req.session.user) return res.render('login', {title:'Express'});
  else next();
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

exports.createSessionUser = function(req, res, next) {
  req.session.user = req.user;
  res.redirect('/');
};


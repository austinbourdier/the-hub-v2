var express = require('express');
var router = express.Router();
var controller = require('../controller');


module.exports = function(app, passport) {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));
  router.get('/auth/fb-success', function(req, res, next){
    req.session.user = req.user;
    res.redirect('/')
  })

  router.get('/auth/fb-fail', function(req, res, next){
    res.redirect('/');
  })

  // require logged in for all routes starting now (don't need to be logged in to log in through facebook, above)

  router.all('*', controller.auth.requireLoggedIn)

  router.get('/', function(req, res, next) {
    controller.render(req,res);
  });

  router.get('/auth/logout', controller.auth.logout)
  app.use(router);
}

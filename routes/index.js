var express = require('express');
var router = express.Router();
var controller = require('../controller');


module.exports = function(app, passport) {
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));
  router.get('/auth/fb-success', controller.auth.createSessionUser)

  router.get('/auth/fb-fail', function(req, res, next){
    controller.redirectHome;
  })

  // require logged in for all routes starting now (don't need to be logged in to log in through facebook, above)

  router.all('*', controller.auth.requireLoggedIn)

  router.get('/', function(req, res, next) {
    controller.render(req,res);
  });

  router.get('/auth/logout', controller.auth.logout)
  router.get('/getUserTextsAndEmails', controller.db.getUserTextsAndEmails)
  app.use(router);
}

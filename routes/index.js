var express = require('express');
var router = express.Router();
var controller = require('../controllers/index');

/* GET home page. */

module.exports = function(app, passport) {
  router.get('/', function(req, res, next) {
    if(!req.session.user) return res.render('index', { title: 'Express' });
    controller.renderDash(req,res);
  });

  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));
  router.get('/auth/fb-success', function(req, res, next){
    req.session.user = req.user;
    res.redirect('/')
  })

  router.get('/auth/fb-fail', function(req, res, next){
    res.redirect('/');
  })
  router.get('/auth/logout', controller.logout)
  app.use(router);
}

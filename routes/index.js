var express = require('express');
var router = express.Router();
var controller = require('../controller');


module.exports = function(app, passport) {

  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));

  router.get('/auth/dropbox/callback', controller.dropbox.getDBoxAccessToken, controller.dropbox.createDBoxClient, controller.dropbox.getDropBoxFiles, controller.render);
  router.get('/auth/googledrive/login', controller.googledrive.generateAuthUrl);
  router.get('/auth/box/callback', controller.box.getBoxAccessToken, controller.box.getBoxFiles,controller.render);
  router.get('/auth/googledrive/callback', controller.googledrive.getGoogleDriveToken, controller.googledrive.getGoogleDriveFiles, controller.render);
  router.get('/auth/box/login', controller.box.authorizeBox);
  router.get('/auth/fb-success', controller.auth.createSessionUser);
  router.get('/auth/dropbox/login', controller.dropbox.getDBoxRequestToken, controller.dropbox.requestDBoxAccessToken);


  router.get('/auth/fb-fail', controller.render);

  // require logged in for all routes starting now (don't need to be logged in to log in through facebook, above)
  router.all('*', controller.auth.requireLoggedIn);

  router.get('/', controller.render);
  router.post('/file-upload', controller.uploader.readFile,controller.googledrive.upload, controller.googledrive.getGoogleDriveFiles,controller.dropbox.upload, controller.dropbox.getDropBoxFiles, controller.box.upload,controller.box.getBoxFiles, controller.sendBackUploadedFiles);

  router.get('/auth/logout', controller.auth.logout);
  app.use(router);
};

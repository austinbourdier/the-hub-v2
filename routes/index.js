var express = require('express');
var router = express.Router();
var controller = require('../controller');


module.exports = function(app, passport) {

  // facebook app oAuth Login
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));
  router.get('/auth/fb-success', controller.auth.createSessionUser);
  router.get('/auth/fb-fail', controller.render);

  router.all('*', controller.auth.requireLoggedIn);
  // require logged in for all routes starting now (don't need to be logged in to log in through facebook to hit the above routes)

  // oAuth logins
  router.get('/auth/dropbox/login', controller.dropbox.getDBoxRequestToken, controller.dropbox.requestDBoxAccessToken);
  router.get('/auth/onedrive/login', controller.onedrive.getOneDriveAuthCode);
  router.get('/auth/googledrive/login', controller.googledrive.generateAuthUrl);
  router.get('/auth/box/login', controller.box.authorizeBox);

  // oAuth callbacks
  router.get('/auth/dropbox/callback', controller.dropbox.getDBoxAccessToken, controller.dropbox.getDropBoxFiles, controller.render);
  router.get('/auth/onedrive/callback', controller.onedrive.getOneDriveAccessToken, controller.onedrive.getOneDriveFiles, controller.render);
  router.get('/auth/googledrive/callback', controller.googledrive.getGoogleDriveToken, controller.googledrive.getGoogleDriveFiles, controller.render);
  router.get('/auth/box/callback', controller.box.getBoxAccessToken, controller.box.getBoxFiles, controller.render);

  router.get('/', controller.render);

  // upload route
  router.post('/file-upload', controller.uploader.readFile, controller.googledrive.upload, controller.googledrive.getGoogleDriveFiles, controller.dropbox.upload, controller.dropbox.getDropBoxFiles, controller.box.upload, controller.box.getBoxFiles, controller.onedrive.upload, controller.onedrive.getOneDriveFiles, controller.sendBackFiles);

  // retrieve folder
  router.get('/folder/dropbox', controller.dropbox.getDropBoxFiles, controller.sendBackFiles);
  router.get('/folder/onedrive', controller.onedrive.getOneDriveFiles, controller.sendBackFiles);
  router.get('/folder/googledrive', controller.googledrive.getGoogleDriveFiles, controller.sendBackFiles);
  router.get('/folder/box', controller.box.getBoxFiles, controller.sendBackFiles);

  // file deletion route
  router.post('/delete/dropbox', controller.dropbox.deleteDropBoxFiles, controller.dropbox.getDropBoxFiles, controller.sendBackFiles);
  router.post('/delete/onedrive', controller.onedrive.deleteOneDriveFiles, controller.onedrive.getOneDriveFiles, controller.sendBackFiles);
  router.post('/delete/googledrive', controller.googledrive.deleteGoogleDriveFiles, controller.googledrive.getGoogleDriveFiles, controller.sendBackFiles);
  router.post('/delete/box', controller.box.deleteBoxFiles, controller.box.getBoxFiles, controller.sendBackFiles);

  // file download routes
  router.get('/download/dropbox/:id', controller.dropbox.downloadDropBoxFiles);
  router.get('/download/onedrive/:id', controller.onedrive.downloadOneDriveFiles);
  router.get('/download/googledrive/:id', controller.googledrive.downloadGoogleDriveFiles);
  router.get('/download/box/:id', controller.box.downloadBoxFiles);

  router.post('/rename/googledrive', controller.googledrive.updateGoogleDriveFileName, controller.googledrive.getGoogleDriveFiles, controller.sendBackFiles);
  router.post('/rename/onedrive', controller.onedrive.updateOneDriveFileName, controller.onedrive.getOneDriveFiles, controller.sendBackFiles);
  router.post('/rename/dropbox', controller.dropbox.updateDropBoxFileName, controller.dropbox.getDropBoxFiles, controller.sendBackFiles);
  router.post('/rename/box', controller.box.updateBoxFileName, controller.box.getBoxFiles, controller.sendBackFiles);

  router.post('/moveFile/box', controller.box.moveBoxFile, controller.sendBackFiles);
  router.post('/moveFile/googledrive', controller.googledrive.moveGoogleDriveFile, controller.sendBackFiles);
  router.post('/moveFile/dropbox', controller.dropbox.moveDropBoxFile, controller.sendBackFiles);

  // logout
  router.get('/auth/logout', controller.auth.logout);
  router.get('/user', controller.user);

  app.use(router);
};


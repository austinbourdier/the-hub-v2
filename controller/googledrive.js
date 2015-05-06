var googleapis = require('googleapis');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.googleDriveClientId || require('../config.js').get('googleDrive:client_id'),
  process.env.googleDriveClientSecret || require('../config.js').get('googleDrive:client_secret'),
  process.env.googleDriveClientRedirect || require('../config.js').get('googleDrive:redirect')
  );
var googledrive = googleapis.drive({ version: 'v2', auth: oauth2Client });
var fs = require('fs');
var options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  }
};
var uploader = require('blueimp-file-upload-expressjs')(options);
exports.generateAuthUrl = function(req, res, next){
  res.redirect(oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive'
  }));
};

exports.getGoogleDriveToken = function(req, res, next){
  oauth2Client.getToken(req.query.code, function(err, tokens) {
  // TODO: Error catch
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });
    next();
  })
};
exports.getGoogleDriveFiles = function(req, res, next){
  googledrive.files.list({ auth: oauth2Client }, function(err, data) {
    // TODO: Error catch
    req.session.user.googledrivefiles = data;
    next();
  });
};

exports.upload = function(req,res,next){
  googledrive.files.insert({resource: {
    title: req.files.file.originalname,
    mimeType: req.files.file.mimetype
  },media: {
    mimeType: req.files.file.mimetype,
    body: req.fileStream
  }, auth: oauth2Client }, function(err, data) {
    // TODO: Error catch
    next();
  });
};

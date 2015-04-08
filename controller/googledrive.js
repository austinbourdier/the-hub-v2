var googleapis = require('googleapis');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.googleDriveClientId || require('../config.js').get('googleDrive:client_id'),
  process.env.googleDriveClientSecret || require('../config.js').get('googleDrive:client_secret'),
  process.env.googleDriveClientRedirect || require('../config.js').get('googleDrive:redirect')
  );
var googledrive = googleapis.drive({ version: 'v2', auth: oauth2Client });

exports.generateAuthUrl = function(req, res, next){
  var googleDriveURI = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive'
  });
  res.redirect(googleDriveURI);
};

exports.getGoogleDriveToken = function(req, res, next){
  oauth2Client.getToken(req.query.code, function(err, tokens) {
  // TODO: Error catch
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });
    req.session.user.googledrive = googledrive;
    res.send('/');
  })
};

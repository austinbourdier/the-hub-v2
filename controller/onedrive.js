var request = require('request');
var querystring = require('querystring');


exports.getOneDriveAuthCode = function(req, res, next) {
  var onedriveQueryData = {
    client_id: process.env.onedriveClientId || require('../config.js').get('onedrive:client_id'),
    scope: 'onedrive.readwrite wl.offline_access wl.signin',
    redirect_uri: process.env.onedriveRedirectUrl || require('../config.js').get('onedrive:redirect'),
    response_type: 'code'
  };
  res.redirect('https://login.live.com/oauth20_authorize.srf?' + querystring.stringify(onedriveQueryData));
};

exports.getOneDriveAccessToken = function(req, res, next) {
  var onedriveQueryData = {
    client_id: process.env.onedriveClientId || require('../config.js').get('onedrive:client_id'),
    redirect_uri: process.env.onedriveRedirectUrl || require('../config.js').get('onedrive:redirect'),
    client_secret: process.env.onedriveClientSecret || require('../config.js').get('onedrive:client_secret'),
    code: req.query.code,
    grant_type: 'authorization_code'
  };
  request({method: 'POST', url: 'https://login.live.com/oauth20_token.srf',
    form: onedriveQueryData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }, function(err, response, body) {
    // TODO: err catch

    req.session.onedrive_access_token = JSON.parse(response.body).access_token;
    next();
  });
};

exports.getOneDriveFiles = function(req, res, next) {
  if(req.session.onedrive_access_token) {
    request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/root/children',
      headers: {
        'Authorization': 'Bearer ' + req.session.onedrive_access_token,
      },
    }, function(err, response, body) {
      // TODO: err catch
      req.session.user.onedrivefiles = JSON.parse(response.body).value.filter(function(object){
        return object["@content.downloadUrl"];
      });
      next();
    });
  } else {
    next();
  }
};

exports.upload = function(req, res, next) {
  if(req.session.onedrive_access_token) {
    request({method: 'PUT', url: 'https://api.onedrive.com/v1.0/drive/root/' + req.files.file.originalname + '/content',
      headers: {
        'Authorization': 'Bearer ' + req.session.onedrive_access_token,
      },
      body: req.fileStream
    }, function(err, response, body) {
      // TODO: err catch
      console.log('YOYOYOYOOYOYOYOYOYOYOYOYO')
      if(err) {
        console.log('ERRRRRROOOOOOORRR')
        console.log(err)
      }
      console.log(response.body)
      next();
    });
  } else {
    next();
  }
};

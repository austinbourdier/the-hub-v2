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

    req.justAdded = 'onedrive';
    req.session.onedrive_access_token = JSON.parse(response.body).access_token;
    if(req.session.user.accessedClouds)
      req.session.user.accessedClouds.onedrive = true;
    else
      req.session.user.accessedClouds = {onedrive: true};
    next();
  });
};

exports.getOneDriveFiles = function(req, res, next) {
  if(req.session.user.accessedClouds.onedrive) {
    if (req.query.folderId) {
      request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/items/' + req.query.folderId + '/children',
        headers: {
          'Authorization': 'Bearer ' + req.session.onedrive_access_token
        },
      }, function(err, response, body) {
        // TODO: err catch
        req.session.user.onedrivefiles = JSON.parse(response.body).value;
        if(req.uploadedOneDriveFile) {
          req.session.user.onedrivefiles.push(req.uploadedOneDriveFile);
        }
        next();
      });
    } else {
      request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/root/children',
        headers: {
          'Authorization': 'Bearer ' + req.session.onedrive_access_token
        },
      }, function(err, response, body) {
        // TODO: err catch
        req.session.user.onedrivefiles = JSON.parse(response.body).value;
        if(req.uploadedOneDriveFile) {
          req.session.user.onedrivefiles.push(req.uploadedOneDriveFile);
        }
        next();
      });
    }
  } else {
    next();
  }
};
exports.deleteOneDriveFiles = function(req, res, next) {
  if(req.session.user.accessedClouds.onedrive) {
    request({method: 'DELETE', url: 'https://api.onedrive.com/v1.0/drive/items/' + req.body.options.id,
      headers: {
        'Authorization': 'Bearer ' + req.session.onedrive_access_token
      },
    }, function(err, response, body) {
      // TODO: err catch
      next();
    });
  } else {
    next();
  }
};
exports.downloadOneDriveFiles = function(req, res, next) {
  if(req.session.user.accessedClouds.onedrive) {
    // res.setHeader('Content-type', file.mimeType);
    request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/items/' + req.params.id,
      headers: {
        'Authorization': 'Bearer ' + req.session.onedrive_access_token
      },
    }, function(err, response, body) {
      res.setHeader('Content-disposition', 'attachment; filename=' + JSON.parse(response.body).name);
      request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/items/' + JSON.parse(response.body).id + '/content',
        headers: {
          'Authorization': 'Bearer ' + req.session.onedrive_access_token
        },
      }, function(err, response, body) {
        // TODO: err catch
        next();
      });
    });
  } else {
    next();
  }
};

exports.upload = function(req, res, next) {
  if(req.session.user.accessedClouds.onedrive) {
    request({method: 'GET', url: 'https://api.onedrive.com/v1.0/drive/root',
      headers: {
        'Authorization': 'Bearer ' + req.session.onedrive_access_token
      },
    }, function(err, response, body) {
      // TODO: err catch
      request({method: 'PUT', url: 'https://api.onedrive.com/v1.0/drive/items/' + JSON.parse(response.body).id + '/children/' + req.files.file.originalname + '/content',
        headers: {
          'Authorization': 'Bearer ' + req.session.onedrive_access_token
        },
        body: req.fileStream
      }, function(err, response, body) {
        // TODO: err catch
        req.uploadedOneDriveFile = JSON.parse(response.body);
        next();
      });
    })
  } else {
    next();
  }
};

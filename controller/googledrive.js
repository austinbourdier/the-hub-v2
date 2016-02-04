var googleapis = require('googleapis');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;
var util = require('../util');

var oauth2Client = new OAuth2(process.env.googleDriveClientId || require('../config.js').get('googleDrive:client_id'),
  process.env.googleDriveClientSecret || require('../config.js').get('googleDrive:client_secret'),
  process.env.googleDriveClientRedirect || require('../config.js').get('googleDrive:redirect')
  );

exports.generateAuthUrl = function (req, res, next) {
  res.redirect(oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive'
  }));
};

exports.getGoogleDriveToken = function (req, res, next) {
  oauth2Client.getToken(req.query.code, function (err, tokens) {
  // TODO: Error catch
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });
    req.justAdded = 'googledrive';
    if(req.session.user.accessedClouds)
      req.session.user.accessedClouds.googledrive = true;
    else
      req.session.user.accessedClouds = {googledrive:true};
    next();
  })
};

exports.getGoogleDriveFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.googledrive) {
    if (req.delete || req.rename) {
      var parentID = req.body.options.parentID;
    };
    var id = parentID || req.body.currentFolder || req.query.folderId || 'root';
    request({method:"GET", url: "https://www.googleapis.com/drive/v2/files?q='" + id + "'+in+parents",
      headers: {Authorization: 'Bearer ' + oauth2Client.credentials.access_token}
    }, function (err, response, body) {
      // TODO: err catch
      var dataPayload = JSON.parse(response.body).items;
      if(!req.session.user.googledrivefiles) {
        dataPayload.forEach(function(item) {
          item.parentID = id;
          item.name = item.title;
          if(item.mimeType == "application/vnd.google-apps.folder") {
            item.type = 'folder';
            item.items = [];
          } else {
            item.type = 'file';
          }
        })
        req.session.user.googledrivefiles = {
          id: id,
          items: dataPayload,
          name: 'root',
          type: 'folder',
          parentID: id
        }
      } else {
        if(req.delete) {
          req.session.user.googledrivefiles = util.updateTreeDeleteItem(id, req.body.options.id, req.session.user.googledrivefiles);
        } else {
          dataPayload.forEach(function(item) {
            item.parentID = id;
            item.name = item.title;
            if(item.mimeType == "application/vnd.google-apps.folder") {
              item.type = 'folder';
              item.items = [];
            } else {
              item.type = 'file';
            }
          })
          req.session.user.googledrivefiles = util.updateTreeWithNewPayLoad(id, dataPayload, req.session.user.googledrivefiles);
        }
      }
      next();
    });
  } else {
    next();
  }
};

exports.updateGoogleDriveFileName = function (req, res, next) {
  if(req.session.user.accessedClouds.googledrive) {
    googleapis.drive({ version: 'v2', auth: oauth2Client }).files.patch({fileId:req.body.options.id, resource: {title: req.body.options.title}}, function (err, file) {
        // TODO: err catch
        req.rename = true;
        if(err && err.code == '403')
          return res.status(err.code).send('Not Authorized');
        else if (err)
          return res.status(err.code);
        else
          next();
    })
  } else {
    next();
  }
};

exports.downloadGoogleDriveFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.googledrive) {
    googleapis.drive({ version: 'v2', auth: oauth2Client }).files.get({fileId:req.params.id}, function (err, file) {
      res.setHeader('Content-disposition', 'attachment; filename=' + file.title);
      res.setHeader('Content-type', file.mimeType);
      request({method:"GET",url:file.downloadUrl,
        headers: {Authorization: 'Bearer ' + oauth2Client.credentials.access_token}
      }).pipe(res).on('error', next);
    })
  } else {
    next();
  }
};
exports.deleteGoogleDriveFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.googledrive) {
    googleapis.drive({ version: 'v2', auth: oauth2Client }).files.delete({ fileId: req.body.options.id }, function (err, data) {
      // TODO: Error catch
      req.delete = true;
      next();
    });
  } else {
    next();
  }
};

exports.moveGoogleDriveFile = function (req, res, next) {
  if(req.session.user.accessedClouds.googledrive) {
    googleapis.drive({ version: 'v2', auth: oauth2Client }).files.update({fileId: req.body.file.id, addParents: req.body.parentID, removeParents: req.body.copy ?  '' : req.body.file.parentID}, function (err, data) {
      // TODO: Error catch
      if(!req.body.copy)
        req.session.user.googledrivefiles = util.updateTreeDeleteItem(req.body.file.parentID, req.body.file.id, req.session.user.googledrivefiles);
      req.session.user.googledrivefiles = util.insertItemIntoTree(req.body.file, req.body.parentID, req.session.user.googledrivefiles);
      next();
    });
  } else {
    next();
  }
};

exports.upload = function (req,res,next) {
  if(req.session.user.accessedClouds.googledrive) {
    googleapis.drive({ version: 'v2', auth: oauth2Client }).files.insert({resource: {
      title: req.files.file.originalname,
      mimeType: req.files.file.mimetype
    },media: {
      mimeType: req.files.file.mimetype,
      body: req.fileStream
    }, auth: oauth2Client }, function (err, data) {
      // TODO: Error catch
      next();
    });
  } else {
    next();
  }
};

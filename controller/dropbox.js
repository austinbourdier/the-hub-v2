var dbox  = require("dbox");
var fs  = require("fs");
var path  = require("path");
var DBoxApp   = dbox.app({'root' : 'dropbox', "app_key": process.env.dropboxAppKey || require('../config.js').get('dropbox:app_key'), "app_secret": process.env.dropboxAppSecret || require('../config.js').get('dropbox:app_secret')})
var dropboxAppCallback = process.env.dropboxAppCallback || require('../config.js').get('dropbox:app_callback');
var util = require('../util');

exports.getDBoxRequestToken = function (req, res, next) {
  DBoxApp.requesttoken(function (status, request_token) {
        // TODO: error catch
    req.session.dbox_request_token = request_token;
    next();
  })
};

exports.requestDBoxAccessToken = function (req, res, next) {
  res.redirect(req.session.dbox_request_token.authorize_url + "&oauth_callback="+dropboxAppCallback);
};

exports.getDBoxAccessToken = function (req, res, next) {
  DBoxApp.accesstoken(req.session.dbox_request_token, function (status, access_token) {
        // TODO: error catch

    req.session.dbox_access_token = access_token;
    req.justAdded = 'dropbox';
    if(req.session.user.accessedClouds)
      req.session.user.accessedClouds.dropbox = true;
    else
      req.session.user.accessedClouds = {dropbox:true};
    next();
  })
};


exports.getDropBoxFiles = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    if (req.delete || req.rename) {
      var parentID = req.body.options.parentID;
    };
    var id = parentID || req.body.currentFolder || req.query.folderId || '/';
    DBoxApp.client(req.session.dbox_access_token).metadata(id, {
      file_limit         : 10000,
      list               : true,
      include_deleted    : false,
      locale             : "en",
      root             : "dropbox"
    }, function (status, data) {
      // TODO: error catch
      if(!req.session.user.dropboxfiles) {
        data.contents.forEach(function(item) {
          item.id = item.path;
          item.parentID = id;
          var temp = item.path;
          item.name = temp.split('/').pop();
          if(item.is_dir) {
            item.type = 'folder';
            item.items = [];
          } else {
            item.type = 'file';
          }
        })
        req.session.user.dropboxfiles = {
          id: id,
          items: data.contents,
          name: '/',
          type: 'folder',
          parentID: id
        }
      } else {
        if(req.delete) {
          req.session.user.dropboxfiles = util.updateTreeDeleteItem(id, req.body.options.id, req.session.user.dropboxfiles);
        } else {
          data.contents.forEach(function(item) {
          item.id = item.path;
          item.parentID = id;
          var temp = item.path;
          item.name = temp.split('/').pop();
            if(item.is_dir) {
              item.type = 'folder';
              item.items = [];
            } else {
              item.type = 'file';
            }
          })
          req.session.user.dropboxfiles = util.updateTreeWithNewPayLoad(id, data.contents, req.session.user.dropboxfiles);
        }
      }
      next();
    })
  } else {
    next();
  }
};

exports.updateDropBoxFileName = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    DBoxApp.client(req.session.dbox_access_token).mv(req.body.id, req.body.title, function (status, data) {
      // TODO: error catch
      req.update = true;
      next();
    })
  } else {
    next();
  }
};

exports.moveDropBoxFile = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    console.log('req.body.file.path, req.body.parentID')
    console.log(req.body.file.path, req.body.parentID)
    DBoxApp.client(req.session.dbox_access_token).mv(req.body.file.path, req.body.parentID, function (status, data) {
      console.log('req.body.file.path, req.body.parentID')
      console.log(req.body.file.path, req.body.parentID)
      // TODO: error catch
      if(!req.body.copy)
        req.session.user.dropboxfiles = util.updateTreeDeleteItem(req.body.file.parentID, req.body.file.id, req.session.user.dropboxfiles);
      req.session.user.dropboxfiles = util.insertItemIntoTree(req.body.file, req.body.parentID, req.session.user.dropboxfiles);
      next();
    })
  } else {
    next();
  }
};

exports.deleteDropBoxFiles = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    DBoxApp.client(req.session.dbox_access_token).rm(req.body.options.id,function (status, data) {
      // TODO: error catch
      req.delete = true;
      next();
    })
  } else {
    next();
  }
};

exports.downloadDropBoxFiles = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    var client = DBoxApp.client(req.session.dbox_access_token);
    var file = req.params.id;
    client.metadata(file, function (status, reply) {
      res.setHeader('Content-disposition', 'attachment; filename=' + file);
      res.setHeader('Content-type', reply.mime_type);
      client
        .stream(file)
        .pipe(res)
        .on('error', next);
    });
  } else {
    next();
  }
};

exports.upload = function (req,res,next) {
  if(req.session.user.accessedClouds.dropbox) {
    DBoxApp.client(req.session.dbox_access_token).put('/'+req.files.file.originalname, req.fileStream, function (status, data) {
      // TODO: error catch
      next();
    })
  } else {
    next();
  }
};

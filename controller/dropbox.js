var dbox  = require("dbox");
var fs  = require("fs");
var path  = require("path");
var DBoxApp   = dbox.app({'root' : 'dropbox', "app_key": process.env.dropboxAppKey || require('../config.js').get('dropbox:app_key'), "app_secret": process.env.dropboxAppSecret || require('../config.js').get('dropbox:app_secret')})
var dropboxAppCallback = process.env.dropboxAppCallback || require('../config.js').get('dropbox:app_callback');
var dropbox;
exports.getDBoxRequestToken = function(req, res, next) {
  DBoxApp.requesttoken(function(status, request_token){
        // TODO: error catch
    req.session.dbox_request_token = request_token;
    next();
  })
};

exports.requestDBoxAccessToken = function(req, res, next) {
  res.redirect(req.session.dbox_request_token.authorize_url + "&oauth_callback="+dropboxAppCallback);
};

exports.getDBoxAccessToken = function(req, res, next) {
  DBoxApp.accesstoken(req.session.dbox_request_token, function(status, access_token){
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


exports.getDropBoxFiles = function(req,res,next){
  if(req.session.user.accessedClouds.dropbox){
    DBoxApp.client(req.session.dbox_access_token).metadata('/',{
      file_limit         : 10000,
      list               : true,
      include_deleted    : false,
      locale             : "en",
      root             : "dropbox"
    },function(status, data){
      // TODO: error catch
      req.session.user.dropboxfiles = data.contents;
      next();
    })
  } else {
    next();
  }
};

exports.deleteDropBoxFiles = function(req,res,next){
  if(req.session.user.accessedClouds.dropbox){
    DBoxApp.client(req.session.dbox_access_token).rm(req.body.id,function(status, data){
      // TODO: error catch
      console.log(status, data)
      next();
    })
  } else {
    next();
  }
};

exports.downloadDropBoxFiles = function(req,res,next){
  if(req.session.user.accessedClouds.dropbox){
    var client = DBoxApp.client(req.session.dbox_access_token);
    var file = req.params.id;
    client.metadata(file, function(status, reply) {
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

exports.upload = function(req,res,next){
  if(req.session.user.accessedClouds.dropbox){
    DBoxApp.client(req.session.dbox_access_token).put('/'+req.files.file.originalname, req.fileStream, function(status, data) {
      // TODO: error catch
      next();
    })
  } else {
    next();
  }
};

var dbox  = require("dbox");
var DBoxApp   = dbox.app({ "app_key": process.env.dropboxAppKey || require('../config.js').get('dropbox:app_key'), "app_secret": process.env.dropboxAppSecret || require('../config.js').get('dropbox:app_secret')})
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

    req.dbox_access_token = access_token;
    next();
  })
};


exports.createDBoxClient = function(req, res, next) {
  dropbox = DBoxApp.client(req.dbox_access_token);
  next();
};

exports.getDropBoxFiles = function(req,res,next){
  dropbox.metadata('/',{
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
};

exports.upload = function(req,res,next){
  dropbox.put('/'+req.files.file.originalname,req.fileStream,function(status, data){
    // TODO: error catch
    next();
  })
};
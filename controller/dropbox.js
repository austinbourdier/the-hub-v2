var dbox  = require("dbox");
var DBoxApp   = dbox.app({ "app_key": process.env.dropboxAppKey || require('../config.js').get('dropbox:app_key'), "app_secret": process.env.dropboxAppSecret || require('../config.js').get('dropbox:app_secret')})

exports.getDBoxRequestToken = function(req, res, next) {
  DBoxApp.requesttoken(function(status, request_token){
        // TODO: error catch

    req.session.dbox_request_token = request_token;
    next();
  })
};

exports.requestDBoxAccessToken = function(req, res, next) {
  res.redirect(req.session.dbox_request_token.authorize_url + "&oauth_callback="+process.env.dropboxAppCallback || require('../config.js').get('dropbox:app_callback'));
};

exports.getDBoxAccessToken = function(req, res, next) {
  DBoxApp.accesstoken(req.session.dbox_request_token, function(status, access_token){
        // TODO: error catch

    req.dbox_access_token = access_token;
    next();
  })
};

exports.createDBoxClient = function(req, res, next) {
  req.session.user.DBoxClient = DBoxApp.client(req.dbox_access_token);
  req.session.DBoxClient.account(function(status, reply){
    // TODO: error catch
    res.redirect('/');
  })
};

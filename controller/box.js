var Box = require('nodejs-box');
var querystring = require('querystring');
var request = require('request');
var boxRedirect = process.env.boxRedirect || require('../config.js').get('box:redirect');
var boxClientID = process.env.boxClientID || require('../config.js').get('box:client_id');
var boxClientSecurityToken = process.env.boxClientSecurityToken || require('../config.js').get('box:client_security_token');
var boxClientSecret = process.env.boxClientSecret||require('../config.js').get('box:client_secret');

exports.authorizeBox = function(req,res,next){
  res.redirect("https://app.box.com/api/oauth2/authorize?response_type=code&client_id=" + boxClientID + "&state=" + boxClientSecurityToken + "&redirect_uri=" + boxRedirect);
};

exports.getBoxAccessToken = function(req,res,next){
  var body = {grant_type:'authorization_code', code: req.query.code, client_id:boxClientID, client_secret:boxClientSecret, redirect_uri: boxRedirect};
  request.post({
    url: 'https://app.box.com/api/oauth2/token',
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body: querystring.stringify(body)
  }, function(error, response, body){
    // TODO: Error catch
    req.session.user.box = new Box({
      access_token: JSON.parse(response.body).access_token,
      refresh_token: JSON.parse(response.body).refresh_token
    });
    next();
  })
};

exports.createBoxClient = function(req, res, next){
  req.session.user.box.folders.root(function(err, data){
    // TODO: Error catch
    req.session.user.boxfiles = data;
    res.redirect('/');
  })
};

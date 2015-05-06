var Box = require('nodejs-box');
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');
var restler = require('restler');
var path = require('path');
var boxRedirect = process.env.boxRedirect || require('../config.js').get('box:redirect');
var boxClientID = process.env.boxClientID || require('../config.js').get('box:client_id');
var boxClientSecurityToken = process.env.boxClientSecurityToken || require('../config.js').get('box:client_security_token');
var boxClientSecret = process.env.boxClientSecret||require('../config.js').get('box:client_secret');
var box; /* box client */
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
    box = new Box({
      access_token: JSON.parse(response.body).access_token,
      refresh_token: JSON.parse(response.body).refresh_token
    });
    next();
  })
};

exports.getBoxFiles = function(req, res, next){
  box.folders.root(function(err, data){
    // TODO: Error catch
    req.session.user.boxfiles = data;
    next();
  })
};

exports.upload = function(req,res,next){
  fs.stat(req.files.file.path, function(err, stats) {
    restler.post("https://upload.box.com/api/2.0/files/content", {
      headers:{
        'Authorization': 'Bearer ' + box.options.access_token
      },
        multipart: true,
        data: {
            "folder_id": "0",
            "filename": restler.file(path.join(req.files.file.path), req.files.file.originalname, stats.size, req.files.file.originalname, req.files.file.mimetype)
        }
    }).on("complete", function(err, response, body) {
        // TODO: Error catch
        // status code 409 signifies that a file with the same name is already in this folder, need to catch for this
        if(JSON.parse(response.statusCode)){
          // repeat file name error catch here
        }
        next();
    });
  });
};

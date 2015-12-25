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
    req.justAdded = 'box';
    req.session.box_access_token = JSON.parse(response.body).access_token;
    req.session.box_refresh_token = JSON.parse(response.body).refresh_token;
    if(req.session.user.accessedClouds)
      req.session.user.accessedClouds.box = true;
    else
      req.session.user.accessedClouds = {box:true};
    next();
  })
};

exports.getBoxFiles = function(req, res, next){
  if(req.session.user.accessedClouds.box){
    var box = new Box({access_token: req.session.box_access_token,refresh_token: req.session.box_refresh_token});
    box.folders.root(function(err, data){
      // TODO: Error catch
      req.session.user.boxfiles = data;
      next();
    })
  } else {
    next();
  }
};

exports.deleteBoxFiles = function(req, res, next){
  if(req.session.user.accessedClouds.box){
    request({method:"DELETE",url:"https://api.box.com/2.0/files/"+req.body.id.id,
      headers:{
        'Authorization': 'Bearer ' + req.session.box_access_token,
        'If-Match':req.body.id.etag
      }
    },function(err, response, body) {
        next();
    });
  } else {
    next();
  }
};

exports.downloadBoxFiles = function(req, res, next){
  if(req.session.user.accessedClouds.box){
    res.setHeader('Content-disposition', 'attachment; filename=' + req.params.id);
    request({method:"GET",url:"https://api.box.com/2.0/files/"+req.params.id+'/content',
      headers:{'Authorization': 'Bearer ' + req.session.box_access_token}
    },function(err, response, body) {
      next();
    }).pipe(res).on('error', next);
  } else {
    next();
  }
};

exports.upload = function(req,res,next){
  if(req.session.user.accessedClouds.box){
    fs.stat(req.files.file.path, function(err, stats) {
      restler.post("https://upload.box.com/api/2.0/files/content", {
        headers:{'Authorization': 'Bearer ' + req.session.box_access_token},
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
  } else {
    next();
  }
};

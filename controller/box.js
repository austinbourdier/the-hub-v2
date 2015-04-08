var Box = require('nodejs-box');
var request = require('request');
exports.authorizeBox = function(req,res,next){
  res.redirect("https://app.box.com/api/oauth2/authorize?response_type=code&client_id="+process.env.boxClientId || require('../config.js').get('box:client_id')+"&state="+process.env.boxClientSecurityToken || require('../config.js').get('box:client_security_token')+"&redirect_uri="+process.env.boxRedirect || require('../config.js').get('box:redirect'));
};

exports.getBoxAccessToken = function(req,res,next){
  var body = {grant_type:'authorization_code', code: req.query.code, client_id:process.env.boxId || require('../config.js').get('box:client_id'), client_secret:process.env.boxSecret || require('../config.js').get('box:client_ecret'), redirect_uri: process.env.boxRedirect || require('../config.js').get('box:redirect')};
  request.post({
    url: 'https://app.box.com/api/oauth2/token',
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body: require('querystring').stringify(body)
  }, function(error, response, body){
    req.box = new Box({
      access_token: JSON.parse(response.body).access_token,
      refresh_token: JSON.parse(response.body).refresh_token
    });
    next();
  })
};

exports.createBoxClient = function(req, res, next){
      // box.folders.root(function(err, data){
    //   console.log(data)
    // })
  req.session.user.box = req.box;
  res.redirect('/');
};

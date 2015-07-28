var onedrive  = require("node-onedrive-unofficial");
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
  console.log(onedriveQueryData)
  request({method: 'POST', url: 'https://login.live.com/oauth20_token.srf',
    form: onedriveQueryData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }, function(err, response, body) {
    // TODO: err catch
    console.log(response)
    console.log("HERERERERERERERRERERERE!!!!!!!!!")
  });
};
// exports.requestDBoxAccessToken = function(req, res, next) {
//   res.redirect(req.session.dbox_request_token.authorize_url + "&oauth_callback="+dropboxAppCallback);
// };

// exports.getDBoxAccessToken = function(req, res, next) {
//   DBoxApp.accesstoken(req.session.dbox_request_token, function(status, access_token){
//         // TODO: error catch

//     req.session.dbox_access_token = access_token;
//     req.session.dropboxAccess = true;
//     next();
//   })
// };


// exports.getDropBoxFiles = function(req,res,next){
//   if(req.session.dropboxAccess){
//     DBoxApp.client(req.session.dbox_access_token).metadata('/',{
//       file_limit         : 10000,
//       list               : true,
//       include_deleted    : false,
//       locale             : "en",
//       root             : "dropbox"
//     },function(status, data){
//       // TODO: error catch
//       req.session.user.dropboxfiles = data.contents;
//       next();
//     })
//   } else {
//     next();
//   }
// };

// exports.deleteDropBoxFiles = function(req,res,next){
//   if(req.session.dropboxAccess){
//     DBoxApp.client(req.session.dbox_access_token).rm(req.body.id,function(status, data){
//       // TODO: error catch
//       console.log(status, data)
//       next();
//     })
//   } else {
//     next();
//   }
// };

// exports.downloadDropBoxFiles = function(req,res,next){
//   if(req.session.dropboxAccess){
//     var client = DBoxApp.client(req.session.dbox_access_token);
//     var file = req.params.id;
//     client.metadata(file, function(status, reply) {
//       res.setHeader('Content-disposition', 'attachment; filename=' + file);
//       res.setHeader('Content-type', reply.mime_type);
//       client
//         .stream(file)
//         .pipe(res)
//         .on('error', next);
//     });
//   } else {
//     next();
//   }
// };

// exports.upload = function(req,res,next){
//   if(req.session.dropboxAccess){
//     DBoxApp.client(req.session.dbox_access_token).put('/'+req.files.file.originalname,req.fileStream,function(status, data){
//       // TODO: error catch
//       next();
//     })
//   } else {
//     next();
//   }
// };

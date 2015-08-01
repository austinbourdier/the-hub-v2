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
  console.log('https://login.live.com/oauth20_authorize.srf?' + querystring.stringify(onedriveQueryData))
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
  request({method: 'POST', url: 'https://login.live.com/oauth20_token.srf',
    form: onedriveQueryData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }, function(err, response, body) {
    // TODO: err catch
    console.log(response.body)
    console.log("HERERERERERERERRERERERE!!!!!!!!!")
    req.session.onedrive_access_token = response.body.access_token;
    next();
  });
};

exports.getOneDriveFiles = function(req,res,next){
  console.log('STILL HERE')
  console.log(req.session.onedrive_access_token)
  if(req.session.onedrive_access_token){
    onedrive.api(req.session.onedrive_access_token, {
      path: '/drive/root'
    }, function(folderListing, err) {
      if (!err) {
        console.log('YOOOOOo')
        console.log(folderListing)
    // do something with folderListing
      } else {
        console.log("YOYOYOYOYOYY")
        console.log(err)
      }
    });
  } else {
    next();
  }
};

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

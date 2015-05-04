var fs = require('fs');
var options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);
exports.upload = function(req, res, next){
  uploader.post(req, res, function(obj) {
    res.send(JSON.stringify(obj));
    next();
  })
};


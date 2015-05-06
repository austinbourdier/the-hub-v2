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
exports.readFile = function(req, res, next){
  fs.readFile(req.files.file.path, function (err, data) {
    // TODO: ERR CATCH
    var newPath = __dirname + "/uploads/" + req.files.file.originalname;
    fs.writeFile(newPath, data, function (err) {
      // TODO: ERR CATCH
          req.fileStream = data;
          next();
    })
  })
};


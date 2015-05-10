var fs = require('fs');

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


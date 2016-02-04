var Box = require('nodejs-box');
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');
var restler = require('restler');
var path = require('path');
var exec = require('child_process').exec;
var boxRedirect = process.env.boxRedirect || require('../config.js').get('box:redirect');
var boxClientID = process.env.boxClientID || require('../config.js').get('box:client_id');
var boxClientSecurityToken = process.env.boxClientSecurityToken || require('../config.js').get('box:client_security_token');
var boxClientSecret = process.env.boxClientSecret||require('../config.js').get('box:client_secret');

exports.authorizeBox = function (req,res,next) {
  res.redirect("https://app.box.com/api/oauth2/authorize?response_type=code&client_id=" + boxClientID + "&state=" + boxClientSecurityToken + "&redirect_uri=" + boxRedirect);
};

exports.getBoxAccessToken = function (req,res,next) {
  var body = {grant_type:'authorization_code', code: req.query.code, client_id:boxClientID, client_secret:boxClientSecret, redirect_uri: boxRedirect};
  request.post({
    url: 'https://app.box.com/api/oauth2/token',
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body: querystring.stringify(body)
  }, function (error, response, body) {
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


function updateTree(id, update, tree) {
  if (tree && tree.id == id) {
    tree.items = update;
  } else {
    if(tree.items) {
      tree.items.map(function(item) {
        return updateTree(id, update, item);
      })
    }
  }
  return tree;
}

function updateTreeDelete(parentID, fileID, tree) {
  if (tree && tree.id == parentID) {
    tree.items.splice(tree.items.map(function(item){return item.id}).indexOf(fileID), 1);
  } else {
    if(tree && tree.items) {
      tree.items.map(function(item) {
        return updateTreeDelete(parentID, fileID, item);
      })
    }
  }
  return tree;
}
function insertIntoTree(file, parentID, tree) {
  if (tree && tree.id == parentID) {
    file.parentID = parentID;
    tree.items.push(file);
  } else {
    if(tree && tree.items) {
      tree.items.map(function(item) {
        return insertIntoTree(file, parentID, item);
      })
    }
  }
  return tree;
}

exports.getBoxFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.box) {
    var box = new Box({access_token: req.session.box_access_token,refresh_token: req.session.box_refresh_token});
    if (req.delete) {
      var parentID = req.body.options.parentID;
    };
    var id = parentID || req.body.currentFolder || req.query.folderId || '0';
    box.folders.info(id, function (err, data) {
      // TODO: Error catch
      if(!req.session.user.boxfiles) {
        data.item_collection.entries.forEach(function(item) {
          item.parentID = id;
          if(item.type == 'folder')
            item.items = [];
        })
        req.session.user.boxfiles = {
          id: data.id,
          items: data.item_collection.entries,
          name: 'root',
          type: 'folder',
          parentID: id
        }
      } else {
        if(req.delete) {
          req.session.user.boxfiles = updateTreeDelete(parseInt(id), req.body.options.id, req.session.user.boxfiles);
        } else {
          data.item_collection.entries.forEach(function(item) {
            item.parentID = id;
            if(item.type == 'folder')
              item.items = [];
          })
          req.session.user.boxfiles = updateTree(parseInt(id), data.item_collection.entries, req.session.user.boxfiles);
        }
      }
      next();
    })
  } else {
    next();
  }
};

exports.deleteBoxFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.box) {
    var box = new Box({access_token: req.session.box_access_token,refresh_token: req.session.box_refresh_token});
    box.files.delete(req.body.options.id, req.body.options.eTag, function(err, data) {
      // TODO: err catch
      req.delete = true;
      next();
    })
  } else {
    next();
  }
};

exports.updateBoxFileName = function (req, res, next) {
  if(req.session.user.accessedClouds.box) {
    var command = 'curl https://api.box.com/2.0/files/' + req.body.id + ' -H "Authorization: Bearer ' + req.session.box_access_token + '"' + " -d '" + JSON.stringify({name: req.body.title}) + "' -X PUT"
    child = exec(command, function(error, stdout, stderr){
      if(error !== null)
      {
        console.log('exec error: ' + error);
      } else {
        next();
      }
    });
  } else {
    next();
  }
};
exports.moveBoxFile = function (req, res, next) {
  if(req.session.user.accessedClouds.box) {
    var action = req.body.copy ? 'POST' : 'PUT';
    var copyString = req.body.copy ? 'copy/' : '';
    var command = 'curl https://api.box.com/2.0/files/' + copyString + req.body.file.id + ' -H "Authorization: Bearer ' + req.session.box_access_token + '"' + " -d '" + JSON.stringify({parent: {id: req.body.parentID}}) + "' -X " + action
    console.log(command)
    child = exec(command, function(error, stdout, stderr){
      if(error !== null)
      {
        console.log('exec error: ' + error);
        console.log('exec error: ' + error);
      } else {
        if(!req.body.copy)
          req.session.user.boxfiles = updateTreeDelete(req.body.file.parentID, req.body.file.id, req.session.user.boxfiles);
        req.session.user.boxfiles = insertIntoTree(req.body.file, req.body.parentID, req.session.user.boxfiles);
        next();
      }
    });
  } else {
    next();
  }
};

exports.downloadBoxFiles = function (req, res, next) {
  if(req.session.user.accessedClouds.box) {
    res.setHeader('Content-disposition', 'attachment; filename=' + req.params.id);
    request({method:"GET",url:"https://api.box.com/2.0/files/"+req.params.id+'/content',
      headers:{'Authorization': 'Bearer ' + req.session.box_access_token}
    },function (err, response, body) {
      next();
    }).pipe(res).on('error', next);
  } else {
    next();
  }
};

exports.upload = function (req,res,next) {
  if(req.session.user.accessedClouds.box) {
    fs.stat(req.files.file.path, function (err, stats) {
      restler.post("https://upload.box.com/api/2.0/files/content", {
        headers:{'Authorization': 'Bearer ' + req.session.box_access_token},
        multipart: true,
        data: {
          "folder_id": "0",
          "filename": restler.file(path.join(req.files.file.path), req.files.file.originalname, stats.size, req.files.file.originalname, req.files.file.mimetype)
        }
      }).on("complete", function (err, response, body) {
          // TODO: Error catch
          // status code 409 signifies that a file with the same name is already in this folder, need to catch for this
          if(JSON.parse(response.statusCode)) {
            // repeat file name error catch here
          }
          next();
      });
    });
  } else {
    next();
  }
};

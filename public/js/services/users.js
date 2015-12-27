app
  .service('UserService', UserService)

function UserService($window, $http){
  return {
    logIn: function (cloud) {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
    },
    getUser: function () {
      return $http.get('/user').then(function(response) {
        if (typeof response.data === 'object') {
          response.data.files = normalize(response.data);
          return response.data;
        } else {
          return $q.reject(response.data);
        }
      }, function(response) {
        return $q.reject(response.data);
      })
    },
    normalizeUser: function(user) {
      user.files = normalize(user);
      return user;
    }
  }
};

function normalize (user) {
  user.files = [];
  if(user.dropboxfiles) {
    user.dropboxfolders = [];
    var tempFiles = [];
    user.dropboxfiles.forEach(function(f){
      if(f.is_dir) {
        user.dropboxfolders.push(f);
      } else {
        f.source = 'dropbox';
        f.title = f.path;
        f.id = f.path;
        tempFiles.push(f)
      }
    });
    user.dropboxfiles = tempFiles;
    user.files = user.files.concat(user.dropboxfiles);
  }
  if(user.onedrivefiles) {
    user.onedrivefolders = [];
    var tempFiles = [];
    user.onedrivefiles.forEach(function (f) {
      if(f["@content.downloadUrl"]) {
        f.source = 'onedrive';
        f.title = f.name;
        f.createdAt = f.createdDateTime;
        tempFiles.push(f);
      } else if (f.folder) {
        user.onedrivefolders.push(f);
      }
    });
    user.onedrivefiles = tempFiles;
    user.files = user.files.concat(user.onedrivefiles);
  }
  if(user.boxfiles && user.boxfiles.item_collection && user.boxfiles.item_collection.entries) {
    user.boxfolders = [];
    var tempFiles = [];
    user.boxfiles.item_collection.entries.forEach(function(f){
      if(f.type == 'folder') {
        user.boxfolders.push(f);
      } else {
        f.source = 'box';
        f.title = f.name;
        tempFiles.push(f);
      }
    });
    user.boxfiles.item_collection.entries = tempFiles;
    user.files = user.files.concat(user.boxfiles.item_collection.entries);
  }
  if(user.googledrivefiles && user.googledrivefiles.items) {
    user.googledrivefolders = [];
    var tempFiles = [];
    user.googledrivefiles.items.forEach(function (f, i) {
      // seperate files from folders, google indicates a file is a folder by mimetype == 'application/vnd.google-apps.folder'
      if(f.mimeType == 'application/vnd.google-apps.folder') {
        user.googledrivefolders.push(f);
      } else {
        f.source = 'googledrive';
        f.title = f.title;
        tempFiles.push(f);
      }
    });
    user.googledrivefiles.items = tempFiles;
    user.files = user.files.concat(user.googledrivefiles.items);
  }
  return user.files;
}

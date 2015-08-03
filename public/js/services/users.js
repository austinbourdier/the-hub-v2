angular.module('mainApp')
  .service('UserService', UserService)

function UserService($window){
  return {
    logIn: function(cloud){
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
    },
    normalizeUser: function(user){
      user.files = [];
      if(user.dropboxfiles) {
        user.dropboxfiles.forEach(function(f){
          f.source = 'dropbox';
          f.title = f.path;
          f.id = f.path;
        });
        user.files = user.files.concat(user.dropboxfiles);
      }
      if(user.onedrivefiles) {
        user.onedrivefiles.forEach(function(f){
          f.source = 'onedrive';
          f.title = f.name;
        });
        user.files = user.files.concat(user.onedrivefiles);
      }
      if(user.boxfiles && user.boxfiles.item_collection && user.boxfiles.item_collection.entries) {
        user.boxfiles.item_collection.entries.forEach(function(f){
          f.source = 'box';
          f.title = f.name;
        });
        user.files = user.files.concat(user.boxfiles.item_collection.entries);
      }
      if(user.googledrivefiles && user.googledrivefiles.items) {
        user.googledrivefiles.items.forEach(function(f){
          f.source = 'googledrive';
          f.title = f.title;
        });
        user.files = user.files.concat(user.googledrivefiles.items);
      }
      console.log(user.files)
      return user;
    }
  }
};

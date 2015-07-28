angular.module('mainApp')
  .controller('homeCtrl', homeController)

function homeController($scope, $http, $window, UserService, FileService) {
  this.user = UserService.normalizeUser(user);
  this.clouds = ['dropbox', 'googledrive', 'box', 'onedrive'];
  this.cloudLogin = function(cloud){
    UserService.logIn(cloud);
  }
  this.deleteFromCloud = function(id, cloud){
    FileService.delete(id, cloud).then(function(data){
      $scope.user = data.user;
    }, function(err){
      console.log(err)
      // TODO: err catch
    });

  }
  this.downloadFromCloud = function(id, cloud){
    FileService.download(id, cloud);
  }
  this.organizeFiles
  $scope.dropzoneConfig = {
    'options': { 'url': '/file-upload' },
    'eventHandlers': {
      'success': function (file, response, body) {
        // TODO: error catch
        $scope.user = response.user;
        $scope.$apply();
      }
    }
  }
}


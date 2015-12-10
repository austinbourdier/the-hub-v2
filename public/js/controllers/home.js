angular.module('mainApp')
  .controller('homeCtrl', homeCtrl)

function homeCtrl($scope, $http, $window, UserService, FileService, toastr) {
  $scope.user = UserService.normalizeUser(user);
  this.clouds = ['dropbox', 'googledrive', 'box', 'onedrive'];
  this.cloudLogin = function(cloud) {
    UserService.logIn(cloud);
  }
  this.deleteFromCloud = function(id, cloud) {
    FileService.delete(id, cloud).then(function(data) {
      toastr.success('Your File Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
      $scope.user = UserService.normalizeUser(data.user);
    }, function(err) {
      console.log(err)
      // TODO: err catch
    });

  }
  this.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }
  $scope.dropzoneConfig = {
    'options': { 'url': '/file-upload' },
    'eventHandlers': {
      'success': function (file, response, body) {
        // TODO: error catch
        toastr.success('Your File Has Been Uploaded');
        $scope.user = UserService.normalizeUser(response.user);
        $scope.$apply();
      }
    }
  }

  $scope.$watch('')
}

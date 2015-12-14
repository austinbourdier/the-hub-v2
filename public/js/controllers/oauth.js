angular.module('mainApp')
  .controller('oauthCtrl', oauthCtrl)

function oauthCtrl($scope, $http, $window, UserService, FileService, toastr) {
  $scope.user = UserService.normalizeUser(user);
  this.clouds = ['dropbox', 'googledrive', 'box', 'onedrive'];
  this.cloudLogin = function(cloud) {
    UserService.logIn(cloud);
  }


}

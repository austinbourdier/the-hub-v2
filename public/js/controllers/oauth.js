angular.module('mainApp')
  .controller('oauthCtrl', oauthCtrl)

function oauthCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr) {
  $scope.user = user;
  $scope.clouds = ['dropbox', 'googledrive', 'box', 'onedrive'];
  $scope.cloudLogin = function(cloud) {
    UserService.logIn(cloud);
  }
}

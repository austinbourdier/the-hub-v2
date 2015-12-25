angular.module('mainApp')
  .controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr) {
  $scope.user = user;
  $scope.toggleClouds = function (cloud) {
    $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
    $scope.tabs[cloud] = true;
  };
  $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
  $rootScope.$on('loggedInCloud', function (args) {
    console.log(args)
  });
}

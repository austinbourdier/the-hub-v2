angular.module('mainApp')
  .controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr, $cookies) {
  $scope.user = user;
  $scope.toggleClouds = function (cloud) {
    $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
    $scope.tabs[cloud] = true;
    $cookies.put('currentCloud', cloud)
  };
  $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
  if(justAdded)
    $scope.toggleClouds(justAdded);
  if($cookies.get('currentCloud'))
    $scope.toggleClouds($cookies.get('currentCloud'));
  $rootScope.$on('userUpdated', function (event, user) {
    $scope.user = user;
  });
}

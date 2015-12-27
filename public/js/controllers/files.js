angular.module('mainApp')
  .controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr, $cookies) {
  $scope.user = user;
  console.log(user)
  $scope.toggleClouds = function (cloud) {
    $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
    $scope.tabs[cloud] = true;
    $cookies.put('currentCloud', cloud);
  };
  $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
  if(justAdded)
    $scope.toggleClouds(justAdded);
  if($cookies.get('currentCloud'))
    $scope.toggleClouds($cookies.get('currentCloud'));
  $rootScope.$on('userUpdated', function (event, user) {
    $scope.user = user;
  });
  $scope.getFolder = function (id, cloud) {
    if(arguments.length == 1) {
      cloud = id;
      id = undefined
    }
    FileService.getFolder(id, cloud).then(function (data) {
      $scope.user = UserService.normalizeUser(data.user);
    }, function (err) {
      toastr.error('Folder information was not retrieved, please try again!');
    })
  }
}

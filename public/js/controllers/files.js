angular.module('mainApp')
  .controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr, $cookies, $state) {
  $scope.user = user;
  $scope.showFolders = true;
  $scope.currentFolders = {'dropbox': $cookies.get('current_dropbox'), 'googledrive': $cookies.get('current_googledrive'), 'box': $cookies.get('current_box'), 'onedrive': $cookies.get('current_onedrive')};
  $scope.currentFoldersID = {'dropbox': $cookies.get('currentID_dropbox'), 'googledrive': $cookies.get('currentID_googledrive'), 'box': $cookies.get('currentID_box'), 'onedrive': $cookies.get('currentID_onedrive')};
  $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};

  $scope.toggleClouds = function (cloud) {
    $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
    $scope.tabs[cloud] = true;
    $cookies.put('currentCloud', cloud);
    $scope.currentTab = $cookies.get('currentCloud')
  };
  $rootScope.$on('updateUser', function(event, user) {
    $scope.user = UserService.normalizeUser(user);
  })
  if(justAdded)
    $scope.toggleClouds(justAdded);
  if($cookies.get('currentCloud'))
    $scope.toggleClouds($cookies.get('currentCloud'));

  $scope.getFolder = function (id, cloud, name) {
    if(arguments.length == 2) {
      name = cloud;
      cloud = id;
      id = undefined
    }
    $scope.currentFolders[$scope.currentTab] = name;
    $scope.currentFoldersID[$scope.currentTab] = id;
    $cookies.put('current_' + cloud, $scope.currentFolders[$scope.currentTab]);
    $cookies.put('currentID_' + cloud, $scope.currentFoldersID[$scope.currentTab]);
    FileService.getFolder(id, cloud).then(function (data) {
      $scope.user = UserService.normalizeUser(data.user);
    }, function (err) {
      toastr.error('Folder information was not retrieved, please try again!');
    })
  }

  $scope.toggleFolderView = function () {
    $scope.showFolders = !$scope.showFolders;
  }
}

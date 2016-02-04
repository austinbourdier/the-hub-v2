angular.module('mainApp')
.controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr, $cookies, $state, ngDialog, $compile, $route) {
  $scope.user = user;
  $scope.showFolders = true;
  $scope.currentFolders = {'dropbox': $cookies.get('current_dropbox'), 'googledrive': $cookies.get('current_googledrive'), 'box': $cookies.get('current_box'), 'onedrive': $cookies.get('current_onedrive')};
  $scope.currentFoldersID = {'dropbox': $cookies.get('currentID_dropbox'), 'googledrive': $cookies.get('currentID_googledrive'), 'box': $cookies.get('currentID_box'), 'onedrive': $cookies.get('currentID_onedrive')};
  $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
  $scope.newTitle = {}
  $scope.oldTitle = {}
  $scope.toggleClouds = function (cloud) {
    $scope.tabs = {'dropbox':false, 'googledrive':false, 'box':false, 'onedrive':false};
    $scope.tabs[cloud] = true;
    $cookies.put('currentCloud', cloud);
    $scope.currentTab = $cookies.get('currentCloud')
  };
  $rootScope.$on('updateUser', function(event, user) {
    $scope.user = user;
    $route.reload();
  })
  if(justAdded)
    $scope.toggleClouds(justAdded);
  if($cookies.get('currentCloud'))
    $scope.toggleClouds($cookies.get('currentCloud'));

  $scope.getFolder = function (event, item) {
    event.stopPropagation();
    console.log(item)
    if(item.type=='folder') {
      FileService.getFolder(item.id, $scope.currentTab).then(function (data) {
        console.log(data.user)
        $rootScope.$emit('updateUser', data.user)
      }, function (err) {
        toastr.error('Folder information was not retrieved, please try again!');
      })
    }
  }
  $scope.deleteFromCloud = function(options, cloud) {
    FileService.delete(options, cloud).then(function(data) {
      toastr.success(options.name + ' Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
      $rootScope.$emit('updateUser', data.user)
    }, function(err) {
      toastr.error(options.name + ' Was NOT Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1) + '. Please try again!');
    });
  }
  $scope.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }
  $scope.renameFile = function(id, parentID, oldTitle) {
    var newTitle = '';
    if($scope.dropboxPrefix) newTitle += $scope.dropboxPrefix + '/';
    newTitle += $scope.newTitle[id];
    FileService.renameFile(id, $scope.currentTab, newTitle, parentID).then(function(data) {
      toastr.success(oldTitle + "'s Name Was Updated to " + newTitle + "!");
      $rootScope.$emit('updateUser', data.user)
    }, function(err) {
      if(err == 'Not Authorized') toastr.error("You are not authorized to update this file! It's probably a shared file or owner by other users.");
      else toastr.error("Something went wrong!");
    });
  }

  $scope.moveFile = function (file, parentID) {
    if(file.parentID !== parentID) {
      FileService.moveFile(file, parentID, $scope.currentTab, $scope.copyFile).then(function(data) {
        toastr.success(file.name + " Was Moved!");
        $scope.user = data.user;
        $window.location.reload();
      }, function(err) {
        toastr.error("Something went wrong!");
      });
    }
  };
  $scope.changeToInputField = function($event, file, title) {
    $scope.oldTitle[file.id] = title;
    $scope.newTitle[file.id] = title;
    var displayTitle = title;
    if($scope.title == 'dropbox') {
      var parts = displayTitle.split('/');
      $scope.dropboxPrefix = parts.slice(0, -1).join('/');
      $scope.newTitle[file.id] = parts.pop();
    }
    var elementStr = '<form id="update-name" ng-submit="renameFile(' + "'" + file.id + "', '" + file.parentID + "', '" + displayTitle + "'" + ')"><input ng-model="newTitle[' + "'" + file.id + "'" + ']" value=' + displayTitle.replace(" ", "&nbsp;") + '></input></form>';
    angular.element(angular.element($event.target).parents()[0].children[0]).replaceWith($compile(elementStr)($scope))
  }
  $scope.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }

  $scope.toggleFolderView = function () {
    $scope.showFolders = !$scope.showFolders;
  }
  $scope.openMoveFileDialog = function (item) {
    $scope.currentFileToMove = item;
    ngDialog.open({
      template: '../../views/directives/move_file.html',
      scope: $scope,
      controller: 'filesCtrl'
    });
  };
}

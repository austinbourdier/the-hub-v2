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
    $state.reload();
    $route.reload();
    $window.location.reload()
  })

  if(justAdded)
    $scope.toggleClouds(justAdded);
  if($cookies.get('currentCloud'))
    $scope.toggleClouds($cookies.get('currentCloud'));

  $scope.getFolder = function (event, item, cloud) {
    event.stopPropagation();
    if(item.type=='folder') {
      console.log(item)
      FileService.getFolder(item.id, cloud).then(function (data) {
        $rootScope.$emit('updateUser', data.user)
      }, function (err) {
        toastr.error('Folder information was not retrieved, please try again!');
      })
    }
  }
  $scope.deleteFromCloud = function(options, cloud) {
    FileService.delete(options, cloud).then(function(data) {
      toastr.success('Your File Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
      $rootScope.$emit('updateUser', data.user)
    }, function(err) {
      toastr.error('Your File Was NOT Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1) + '. Please try again!');
    });
  }
  $scope.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }
  $scope.renameFile = function(id) {
    var newTitle = '';
    if($scope.dropboxPrefix) newTitle += $scope.dropboxPrefix + '/';
    newTitle += $scope.newTitle[id];
    FileService.renameFile(id, $scope.currentTab, newTitle).then(function(data) {
      toastr.success("Your File's Name Was Updated!");
      $rootScope.$emit('updateUser', data.user)
    }, function(err) {
      if(err == 'Not Authorized') toastr.error("You are not authorized to update this file! It's probably a shared file or owner by other users.");
      else toastr.error("Something went wrong!");
    });
  }

  $scope.treeOptions = {
    dropped: function(eventArgs) {
      var file = eventArgs.source.nodeScope.$modelValue;
      var parentID = eventArgs.dest.nodesScope.$modelValue[0].parentID;
      if(file.parentID !== parentID) {
        FileService.moveFile(file, parentID, $scope.currentTab).then(function(data) {
          toastr.success("Your File Was Moved!");
          $rootScope.$emit('updateUser', data.user)
        }, function(err) {
          toastr.error("Something went wrong!");
        });
      }
    }
  };
  $scope.changeToInputField = function($event, id, title) {
    $scope.oldTitle[id] = title;
    $scope.newTitle[id] = title;
    var displayTitle = title;
    if($scope.title == 'dropbox') {
      var parts = displayTitle.split('/');
      $scope.dropboxPrefix = parts.slice(0, -1).join('/');
      $scope.newTitle[id] = parts.pop();
    }
    // console.log(angular.element(angular.element($event.target).parents()[3].children[0].children[0]).replaceWith($compile(elementStr)($scope)))
    var elementStr = '<form id="update-name" ng-submit="renameFile(' + "'" + id + "'" + ')"><input ng-model="newTitle[' + "'" + id + "'" + ']" value=' + displayTitle.replace(" ", "&nbsp;") + '></input></form>';
    console.log(angular.element(angular.element($event.target).parents()[3].children[0].children[0]).replaceWith($compile(elementStr)($scope)))
    // angular.element(angular.element($event.target).parents()[3].children[0].children[0]).replaceWith($compile(elementStr)($scope));
  }
  $scope.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }
  $scope.moveFile = function(itemToMove, id) {
    console.log(itemToMove, id)
    event.stopPropagation();
    if(itemToMove.parentID !== id) {
      FileService.moveFile(itemToMove, id, $scope.currentTab).then(function(data) {
        toastr.success("Your File Was Moved!");
        $rootScope.$emit('updateUser', data.user)
      }, function(err) {
        toastr.error("Something went wrong!");
      });
    }
  },
  $scope.toggleFolderView = function () {
    $scope.showFolders = !$scope.showFolders;
  }

  $scope.openDialog = function (item) {
    $scope.currentFileToMove = item;
    ngDialog.open({
      template: '../../views/directives/move_file.html',
      scope: $scope
    });
  };

}

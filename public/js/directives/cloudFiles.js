app
.directive('cloudFiles', cloudFiles)

function cloudFiles($compile, $state) {
  return {
    restrict: 'AE',
    templateUrl: "../../views/directives/cloud_files.html",
    scope: {
      title: '@cloud',
      currentfolder: '=',
      files: '=',
      opendialog: '&',
      download: '&',
      delete: '&'
    },
    controller: function($scope, $rootScope, toastr, FileService, UserService) {
      $scope.newTitle = {};
      $scope.oldTitle = {};
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
        FileService.renameFile(id, $scope.title.replace(" ", ""), $scope.currentfolder, newTitle).then(function(data) {
          toastr.success("Your File's Name Was Updated!");
          $rootScope.$emit('updateUser', data.user)
        }, function(err) {
          if(err == 'Not Authorized') toastr.error("You are not authorized to update this file! It's probably a shared file or owner by other users.");
          else toastr.error("Something went wrong!");
        });
      }
      $scope.changeToInputField = function($event, id, title) {
        $scope.oldTitle[id] = title;
        $scope.newTitle[id] = title;
        var displayTitle = title;
        if($scope.title == 'dropbox') {
          var parts = displayTitle.split('/');
          $scope.dropboxPrefix = parts.slice(0, -1).join('/');
          $scope.newTitle[id] = parts.pop();
        }
        var elementStr = '<form id="update-name" ng-submit="renameFile(' + "'" + id + "'" + ')"><input ng-model="newTitle[' + "'" + id + "'" + ']" value=' + displayTitle.replace(" ", "&nbsp;") + '></input></form>';
        angular.element(angular.element($event.target).parents()[3].children[0].children[0]).replaceWith($compile(elementStr)($scope));
      }
    },
  };
}


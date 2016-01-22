app
.directive('cloudFiles', cloudFiles)

function cloudFiles($compile, $state) {
  return {
    restrict: 'AE',
    templateUrl: "../../views/directives/cloud_files.html",
    scope: {
      title: '@cloud',
      files: '=',
      download: '&',
      delete: '&'
    },
    controller: function($scope, toastr, FileService, UserService) {
      $scope.newTitle = {};
      $scope.oldTitle = {};
      $scope.deleteFromCloud = function(id, cloud) {
        FileService.delete(id, cloud).then(function(data) {
          toastr.success('Your File Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
          $scope.user = UserService.normalizeUser(data.user);
        }, function(err) {
          toastr.error('Your File Was NOT Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1) + '. Please try again!');
        });
      }
      $scope.downloadFromCloud = function(id, cloud) {
        FileService.download(id, cloud);
      }
      $scope.renameFile = function(id) {
        console.log($scope.title.replace(" ", ""))
        FileService.renameFile(id, $scope.title.replace(" ", ""), $scope.newTitle[id]).then(function(data) {
          toastr.success("Your File's Name Was Updated!");
          $scope.user = UserService.normalizeUser(data.user);
          $state.reload();
        }, function(err) {
          if(err == 'Not Authorized')
            toastr.error("You are not authorized to update this file! It's probably shared or owner by other users.");
          else
            toastr.error("Something went wrong!");
          $state.reload();
        });
      }
      $scope.changeToInputField = function($event, id, title) {
        console.log(title)
        $scope.oldTitle[id] = title;
        $scope.newTitle[id] = title;
        var elementStr = '<form id="update-name" ng-submit="renameFile(' + "'" + id + "'" + ')"><input ng-model="newTitle[' + "'" + id + "'" + ']" value=' + title.replace(" ", "&nbsp;") + '></input></form>';
        angular.element(angular.element($event.target).parents()[3].children[0].children[0]).replaceWith($compile(elementStr)($scope));
      }
    },
  };
}


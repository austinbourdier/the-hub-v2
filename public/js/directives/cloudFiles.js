app
.directive('cloudFiles', cloudFiles)

function cloudFiles() {
  return {
    restrict: 'AE',
    templateUrl: "../../views/directives/cloud_files.html",
    scope: {
      title: '@cloud',
      files: '=',
      download: '&',
      delete: '&'
    },
    controller: function($scope, toastr, FileService) {
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
    },
  };
}


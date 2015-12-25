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
    controller: function($scope, $rootScope, $http, toastr, FileService) {
      $scope.deleteFromCloud = function(id, cloud) {
        console.log('delete')
        FileService.delete(id, cloud).then(function(data) {
          toastr.success('Your File Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
          $scope.user = UserService.normalizeUser(data.user);

        }, function(err) {
          console.log(err)
          // TODO: err catch
        });
      }
      $scope.downloadFromCloud = function(id, cloud) {
        console.log('download')
        FileService.download(id, cloud);
      }
    },
  };
}


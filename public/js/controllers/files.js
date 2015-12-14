angular.module('mainApp')
  .controller('filesCtrl', filesCtrl)

function filesCtrl($scope, $http, $window, UserService, FileService, toastr) {
    this.deleteFromCloud = function(id, cloud) {
    FileService.delete(id, cloud).then(function(data) {
      toastr.success('Your File Was Deleted From ' + cloud.charAt(0).toUpperCase() + cloud.slice(1));
      $scope.user = UserService.normalizeUser(data.user);
    }, function(err) {
      console.log(err)
      // TODO: err catch
    });

  }
  this.downloadFromCloud = function(id, cloud) {
    FileService.download(id, cloud);
  }
}

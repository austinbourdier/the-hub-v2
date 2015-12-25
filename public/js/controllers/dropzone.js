angular.module('mainApp')
  .controller('dropzoneCtrl', dropzoneCtrl)

function dropzoneCtrl($scope, $http, $window, UserService, FileService, toastr) {
  $scope.user = user;
  $scope.dropzoneConfig = {
    'options': { 'url': '/file-upload' },
    'eventHandlers': {
      'success': function (file, response, body) {
        // TODO: error catch
        toastr.success('Your File Has Been Uploaded');
        $scope.user = UserService.normalizeUser(response.user);
        $scope.$apply();
      }
    }
  }
}

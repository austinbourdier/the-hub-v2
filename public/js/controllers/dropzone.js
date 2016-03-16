angular.module('mainApp')
  .controller('dropzoneCtrl', dropzoneCtrl)

function dropzoneCtrl($rootScope, $scope, $http, $window, FileService, toastr, user) {
  $scope.user = user;
  $scope.dropzoneConfig = {
    'options': { 'url': '/file-upload' },
    'eventHandlers': {
      'success': function (file, response, body) {
        // TODO: error catch
        toastr.success('Your File Has Been Uploaded');
        $scope.user = response.user;
        $scope.$apply();
        $rootScope.$emit('updateUser', $scope.user);
      }
    }
  }
}

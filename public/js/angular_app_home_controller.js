angular.module('mainApp')
  .controller('homeCtrl', homeController)
  .service('UserService', UserService)
  .directive('dropzone', DropzoneDirective);

function homeController($rootScope, $scope, UserService) {
  $scope.user = {};

  this.dropboxLogin = function() {
    UserService.logIn('dropbox');
  }
  this.boxLogin = function() {
    UserService.logIn('box');
  }
  this.googleDriveLogin = function() {
    UserService.logIn('googledrive');
  }
}

function UserService($window) {
  this.logIn = function(cloud) {
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
  };
}


function DropzoneDirective($rootScope) {
  return function(scope, element, attrs) {
    var dropzoneConfig = {
        'options': { // passed into the Dropzone constructor
          'url': '/file-upload'
        },
        'eventHandlers': {
          'error': function(file, xhr, formData) {
            // TODO: error catch
          },
          'success': function(file, response, body) {
            console.log(file, response, body)
              // TODO: error catch
            scope.user = response.user;
          }
        }
      }
      // create a Dropzone for the element with the given options
    var dropzone = new Dropzone(element[0], dropzoneConfig.options);

    // bind the given event handlers
    angular.forEach(dropzoneConfig.eventHandlers, function(handler, event) {
      dropzone.on(event, handler);
    });
  };
}

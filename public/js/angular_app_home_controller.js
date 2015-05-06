mainApp.controller('homeCtrl', function($scope, $http,$window, $rootScope, $location) {
  $scope.user = user;
  this.dropboxLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/dropbox/login'
  }
  this.boxLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/box/login'
  }
  this.googleDriveLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/googledrive/login'
  }
  $scope.dropzoneConfig = {
    'options': { // passed into the Dropzone constructor
      'url': '/file-upload'
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {
        // TODO: error catch
      },
      'error': function (file, xhr, formData) {
        // TODO: error catch
      },
      'success': function (file, response, body) {
        // TODO: error catch
        $scope.user = response.user;
        $scope.$apply()
      }
    }
  };

})

.directive('dropzone', function () {
  return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
      // });
  };
});

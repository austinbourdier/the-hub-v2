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
      },
      'success': function (file, response, body) {
        // TODO: shouldn't be adding the name of file to array. for some reason the user from the server viw file 'index.html' isn't reevaluating.
        $scope.user.googledrivefiles.items.unshift({title:file.name});
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

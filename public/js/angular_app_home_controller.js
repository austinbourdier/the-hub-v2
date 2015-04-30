mainApp.controller('homeCtrl', function($scope, $http,$window, $rootScope, $location) {
  // this.user assigned to the swig
  this.user = {{user|raw|json_encode}};
  this.dropboxLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/dropbox/login'
  }
  this.boxLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/box/login'
  }
  this.googleDriveLogin = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/googledrive/login'
  }
})


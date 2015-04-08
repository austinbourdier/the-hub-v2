mainApp.controller('homeCtrl', function($scope, $http, $rootScope, $location) {
  $http.defaults.useXDomain = true;
  this.dropboxLogin = function(){
    console.log('logging into dropbox')

    $http.get('/auth/dropbox/login')
    .success(function (data, status, headers, config) {
      console.log(data)
    });
  }
  this.boxLogin = function(){
    console.log('logging into box')
    $http.get('/auth/box/login')
    .success(function (data, status, headers, config) {
      console.log(data)
    });
  }
  this.googleDriveLogin = function(){
    console.log('logging into google drive')

    $http.get('/auth/googledrive/login')
    .success(function (data, status, headers, config) {
      console.log(data)
    });
  }
})

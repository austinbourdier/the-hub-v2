angular.module('mainApp')
.controller('navCtrl', function($scope, $http, $window, $rootScope, $location) {
  $scope.logout=function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/logout'
  }
  $scope.$on('userLoggedIn', function($event, user){
  	console.debug('User broadcasted to navCtrl :: navCtrl <-- home ctrl <--  directive', user);
  })
})


mainApp.controller('navCtrl', function($scope, $http,$window, $rootScope, $location) {
  $scope.logout=function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/logout'
  }
})


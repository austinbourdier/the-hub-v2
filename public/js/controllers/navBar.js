angular.module('mainApp')
.controller('navCtrl', NavController)

function NavController($scope, $window) {
  $scope.logout=function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/logout'
  }
}

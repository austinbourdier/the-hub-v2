angular.module('mainApp')
.controller('navCtrl', NavController)

function NavController($scope, $window, $cookies) {
  $scope.logout = function () {
    angular.forEach($cookies.getAll(), function (v, k) {
      $cookies.remove(k);
    });
    $window.location = $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/logout';
  }
}

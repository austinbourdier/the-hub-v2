angular.module('mainApp')
  .service('UserService', UserService)

function UserService($window){
  return {
    logIn: function(cloud){
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
    }
  }
};

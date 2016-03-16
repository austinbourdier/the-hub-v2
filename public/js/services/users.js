app
  .service('UserService', UserService)

function UserService($window, $http){
  return {
    logIn: function (cloud) {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
    },
    getUser: function () {
      return $http.get('/user').then(function(response) {
        if (typeof response.data === 'object') {
          return response.data;
        } else {
          return $q.reject(response.data);
        }
      }, function(response) {
        return $q.reject(response.data);
      })
    }
  }
};
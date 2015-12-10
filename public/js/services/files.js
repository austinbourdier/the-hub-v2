angular.module('mainApp')
  .service('FileService', FileService)

function FileService($http, $q, $window){
  return {
    delete: function (id, cloud) {
      return $http.post('/delete/' + cloud, {id: id}).then(function (response) {
        if (typeof response.data === 'object') {
          return response.data;
        } else {
          return $q.reject(response.data);
        }
      }, function(response) {
        return $q.reject(response.data);
      })
    },
    download: function (id, cloud) {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/download/' + cloud + '/'+id.replace('/','%2F');
    }
  };
};

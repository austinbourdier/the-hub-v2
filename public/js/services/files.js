app
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
    convertNumCloudsToClassName: function (numClouds) {
      if(numClouds == 1)
        return 'full';
      else if(numClouds == 2)
        return 'one-half';
      else if(numClouds == 3)
        return 'one-third';
      else if(numClouds == 4)
        return 'one-fourth';
      else
        return 'none';
    },
    download: function (id, cloud) {
      $window.location = $window.location.protocol + '//' + $window.location.host + '/download/' + cloud + '/'+id.replace('/','%2F');
    }
  };
};

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
    getFolder: function (id, cloud) {
      console.log('CLIENT')
      console.log(id)
      return $http.get('/folder/' + cloud, {params: {folderId: id}}).then(function (response) {
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

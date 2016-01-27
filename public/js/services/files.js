app
  .service('FileService', FileService)

function FileService($http, $q, $window){
  return {
    delete: function (options, cloud) {
      return $http.post('/delete/' + cloud, {options: options}).then(function (response) {
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
    renameFile: function (id, cloud, currentFolder, title) {
      return $http.post('/rename/' + cloud, {id: id, currentFolder: currentFolder, title: title}).then(function (response) {
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

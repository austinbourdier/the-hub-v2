angular.module('mainApp')
  .controller('homeCtrl', homeController)
  .service('UserService', UserService)
  .service('FileService', FileService)
  .directive('dropzone', DropzoneDirective);

function homeController($scope, $http, $window, UserService, FileService) {
  $scope.user = user;
  this.cloudLogin = function(cloud){
    UserService.logIn(cloud);
  }
  this.deleteFromCloud = function(id, cloud){
    FileService.delete(id, cloud).then(function(data){
      $scope.user = data.user;
    }, function(err){
      console.log(err)
      // TODO: err catch
    });
  }
  this.downloadFromCloud = function(id, cloud){
    FileService.download(id, cloud);
  }
  $scope.dropzoneConfig = {
    'options': { 'url': '/file-upload' },
    'eventHandlers': {
      'success': function (file, response, body) {
        // TODO: error catch
        $scope.user = response.user;
        $scope.$apply();
      }
    }
  }
}

function UserService($window){
  return {
    logIn: function(cloud){
      $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/' + cloud + '/login';
    }
  }
};

function FileService($http, $q, $window){
  return {
    delete: function(id, cloud){
      return $http.post('/delete/'+cloud, {id: id}).then(function(response){
        if (typeof response.data === 'object') {
          return response.data;
        } else {
          return $q.reject(response.data);
        }
      }, function(response) {
        return $q.reject(response.data);
      })
    },
    download: function(id, cloud){
      $window.location = $window.location.protocol + '//' + $window.location.host + '/download/' + cloud + '/'+id.replace('/','%2F');
    }
  };
}
function DropzoneDirective() {
  return function (scope, element, attrs) {
    var config = scope[attrs.dropzone]
    // create a Dropzone for the element with the given options
    var dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
}

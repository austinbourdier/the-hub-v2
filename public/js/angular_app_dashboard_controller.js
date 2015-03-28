mainApp.controller('dashboardCtrl', function($scope, $http, $rootScope, $location) {
  this.initialize = function() {
    this.getUserTextsAndEmails();
  }
  this.getUserTextsAndEmails = function(){
    $http.get('/getUserTextsAndEmails')
    .success(function (data, status, headers, config) {
      console.log(data)
      if(!data.err){
        $scope.texts = JSON.parse(data.texts);
        $scope.emails = JSON.parse(data.emails);
      } else {
        alert(data.err);
      }
    });
  }
})

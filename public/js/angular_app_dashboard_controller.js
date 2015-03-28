mainApp.controller('dashboardCtrl', function($scope, $http, $rootScope, $location) {
  this.initialize = function() {
    this.getUserTextsAndEmails();
  }
  this.getUserTextsAndEmails = function(){
    $http.get('/getUserTextsAndEmails')
    .success(function (data, status, headers, config) {
      if(!data.err){
        $scope.texts = JSON.stringify(data.texts);
        $scope.emails = JSON.stringify(data.emails);
      } else {
        alert(data.err);
      }
      console.log($scope.texts)
    });
  }
})

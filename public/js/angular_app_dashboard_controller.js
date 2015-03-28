mainApp.controller('dashboardCtrl', function($scope, $http, $rootScope, $location) {
  this.initialize = function() {
    this.getUserTextsAndEmails();
  }
  this.getUserTextsAndEmails = function(){
    $http.get('/getUserTextsAndEmails')
    .success(function (data, status, headers, config) {
      console.log(data)
      console.log(status)
      if(!data.err){
        $scope.texts = data.texts;
        $scope.emails = data.emails;
      } else {
        alert(data.err);
      }
    });
  }
})

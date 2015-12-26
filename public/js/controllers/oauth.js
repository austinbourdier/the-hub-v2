angular.module('mainApp')
  .controller('oauthCtrl', oauthCtrl)

function oauthCtrl($scope, $rootScope, $http, $window, UserService, FileService, toastr) {
  $scope.user = user;
  $scope.clouds = ['dropbox', 'googledrive', 'box', 'onedrive'];
  $scope.cloudLogin = function(cloud) {
    UserService.logIn(cloud);
  }
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    angular.element('#sidebar .sub-menu > a').click(function () {
      angular.element('#sidebar .sub-menu ul').removeClass('showAccordion');
      angular.element(this).next().addClass('showAccordion');
    })
  });
}

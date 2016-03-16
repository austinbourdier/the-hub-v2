angular.module('mainApp')
  .controller('oauthCtrl', oauthCtrl)

function oauthCtrl($scope, UserService, user) {
  $scope.user = user;
  console.log(user)
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

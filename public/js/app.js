var app = angular.module('mainApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'toastr', 'ngCookies']);

app
  .run(function(UserService) {
    user = UserService.normalizeUser(user);
  });

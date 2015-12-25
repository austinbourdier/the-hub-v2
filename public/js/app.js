var app = angular.module('mainApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'toastr']);

app
  .run(function(UserService) {
    user = UserService.normalizeUser(user);
  });

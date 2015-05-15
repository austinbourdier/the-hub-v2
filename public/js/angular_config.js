angular.module('mainApp', ['ui.router'])
.config(config)

function config( $stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider, $httpProvider ) {
    
  $stateProvider

  .state('home', {
    url: '/',
    controller: 'homeCtrl as ctrl',
    templateUrl: "/views/home.html"
  })
  .state('manage', {
    url: '/manage',
    controller: 'manageCtrl as ctrl',
    templateUrl : '/views/manage.html'
  })
  .state('dashboard', {
    url: '/dashboard',
    controller: 'dashboardCtrl as ctrl',
    templateUrl : '/views/dashboard.html'
  })
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
};


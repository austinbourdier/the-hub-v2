mainApp.config(config)

function config( $stateProvider, $urlRouterProvider, $interpolateProvider ) {
    
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
  $urlRouterProvider.otherwise("/");

  $stateProvider

  .state('home', {
    url: '/',
    controller: 'homeCtrl as ctrl',
    templateUrl: "/views/home.html"
  })
  .state('dashboard', {
    url: '/dashboard',
    controller: 'dashboardCtrl as ctrl',
    templateUrl : '/views/dashboard.html'
  })

};


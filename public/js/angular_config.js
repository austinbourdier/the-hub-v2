mainApp.config(config)

function config( $stateProvider, $urlRouterProvider, $interpolateProvider, $httpProvider ) {
    
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
  $urlRouterProvider.otherwise("/");
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
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


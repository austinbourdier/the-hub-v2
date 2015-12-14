app
.config(config)

function config( $stateProvider, $urlRouterProvider, $locationProvider, $interpolateProvider, $httpProvider ) {
    
  $stateProvider

  .state('home', {
    url: '/',
    views : {
      'oauth': {
        controller: 'oauthCtrl as ctrl',
        templateUrl: "/views/oauth.html"
      },
      'files': {
        controller: 'filesCtrl as ctrl',
        templateUrl: "/views/files.html"
      },
      'dropzone': {
        controller: 'dropzoneCtrl as ctrl',
        templateUrl: "/views/dropzone.html"
      }
    }
  })

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
};


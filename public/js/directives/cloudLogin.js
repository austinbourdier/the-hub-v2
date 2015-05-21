angular.module('mainApp')
  .directive('cloudLogin', CloudLoginDirective);

function CloudLoginDirective() {
  return {
    restrict: 'AE',
    template: "<a ng-click='ctrl.cloudLogin(cloud)'><img ng-src='../images/{{cloud}}.png'/></a>",
    link: function(scope, element, attrs) {
      attrs.$observe('cloud', function(cloud) {
        scope.cloud = cloud;
      });
    },
  };
}


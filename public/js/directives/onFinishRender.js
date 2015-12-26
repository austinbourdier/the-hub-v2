angular.module('mainApp')
.directive('onFinishRender', onFinishRender);

function onFinishRender() {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        element.ready(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
};

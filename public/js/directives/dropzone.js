app
  .directive('dropzone', DropzoneDirective)

function DropzoneDirective() {
  return function (scope, element, attrs) {
    var config = scope[attrs.dropzone]
    // create a Dropzone for the element with the given options
    var dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
};

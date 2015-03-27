mainApp.controller('homeCtrl', function($scope, $http, $rootScope, $location) {
  this.initialize = function() {
    this.singleTextRecipient;
    this.singleTextBody;
  }
  this.changeSingleMessageType = function(type) {
    this.singleMessageType=type;
  }
  this.changeScheduledMessageType = function(type) {
    this.scheduledMessageType=type;
  }
  this.sendSingleText = function(){
    $http.post('/sendSingleText', {recepient:this.singleTextRecipient, body:this.singleTextBody})
    .success(function (data, status, headers, config) {
      if(!data.err){
        alert('text sent!')
      } else {
        alert('text was not sent...')
      }
    });
  }
  this.sendSingleEmail = function(){
    $http.post('/sendSingleEmail', {recepient:this.singleEmailRecipient, body:this.singleEmailBody})
    .success(function (data, status, headers, config) {
      if(!data.err){
        alert('email sent!')
      } else {
        alert('email not sent...')
      }
    });
  }
})

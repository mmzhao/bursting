app = angular.module('utilities');

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { // home page and tabs
      url: '/home',
      views: {
        '': {
          templateUrl: '/home/home.html',
          controller: 'ProductCtrl',
          resolve: {
            userPromise: ['Backend', function(Backend) {
              return Backend.getUsers();
            }],
            restroomPromise: ['Backend', function(Backend) {
              return Backend.getRestrooms();
            }],
          }
        },
      }
    });

  $urlRouterProvider.otherwise('home'); // unknown urls default to home page
}]);
'use strict';

angular.module('betweenTheLines', [
  'ngRoute',
  'Controllers',
  'Services',
  'Directives',
  'ui.bootstrap'
])

  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: 'views/home.html',
          controller: 'MainCtrl'
        })
        .when('/graph1', {
          templateUrl: 'views/graphs/graph1.html',
          controller: 'GraphControl'
        })
    }
])

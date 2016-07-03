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
        .when('/graphs', {
          templateUrl: 'views/graphs/graph1.html',
          controller: 'MainCtrl'
        })
    }
])

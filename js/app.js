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
        .when('/main', {
          templateUrl: 'views/graphs/scatter.html',
          controller: 'MainCtrl'
        })
    }
])

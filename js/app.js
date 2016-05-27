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
        });
    }
])

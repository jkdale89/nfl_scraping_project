// 'use strict';

/* Directives */

// Custom directives. To make template changes, visit views/
  // KEEP THIS IN ALPHABETICAL ORDER, please :)

(function() {
  var
    footer = function() {
      return {
        restrict: 'E',
        templateUrl: 'views/partials/footer.html',
        replace: false,
        link: function($scope, element, attr) {}
      }
    },

    hed = function(){
      return {
        restrict: 'EA',
        templateUrl: 'views/partials/header.html',
        controller: 'MainCtrl',
        replace: false
      }
    },

    main = function(){
      return {
        restrict: 'EA',
        templateUrl: 'views/partials/main.html',
        controller: 'MainCtrl',
        replace: false
      }
    },

    tableTeams = function(){
      return{
        restrict: 'E',
        templateUrl: 'views/partials/tableTeams.html',
        replace: false
      }
    },

    tableFavsDogs = function(){
      return{
        restrict: 'E',
        templateUrl: 'views/partials/tableFavsDogs.html',
        replace: false
      }
    },

    tableHomeAway = function(){
      return {
        restrict: 'E',
        templateUrl: 'views/partials/tableHomeAway.html',
        replace: false
      }
    },

    graph = function(){
      return {
        restrict: 'E',
        templateUrl: 'views/graphs/graph1.html',
        controller: 'GraphControl',
        replace: false
      }
    }




  // This maps the above variables to their own elements, so we can use "<chart></chart>"
  // to insert the pie.html into the element. This gives direction to our html and separates our concerns
  angular.module('Directives', [])
    .directive('footer', footer)
    .directive('graph', graph)
    .directive('hed', hed)
    .directive('main', main)
    .directive('tableTeams', tableTeams)
    .directive('tableFavsDogs', tableFavsDogs)
    .directive('tableHomeAway', tableHomeAway)
}());

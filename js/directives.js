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
    }


  // This maps the above variables to their own elements, so we can use "<chart></chart>"
  // to insert the pie.html into the element. This gives direction to our html and separates our concerns
  angular.module('Directives', [])
    .directive('footer', footer)
    .directive('hed', hed)
}());

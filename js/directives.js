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

    teamsAts = function(){
      return {
        restrict: 'E',
        template: "<div ng-init=\"newChart('Denver')\" class='teams_ats_graph'></div>",
        controller: 'teamsAtsGraphCtrl',
        replace: false
      }
    },

    teamsOu = function(){
      return {
        restrict: 'E',
        template: "<div ng-init=\"newOuChart('Denver')\" class='teams_ou_graph'></div>",
        controller: 'teamsOuGraphCtrl',
        replace: false
      }
    },

    teamsMl = function(){
      return {
        restrict: 'E',
        template: "<div ng-init=\"newMlChart('Denver')\" class = 'teams_ml_graph_favs'></div>" +
                  "<div class = 'teams_ml_graph_dogs'></div>" +
                  "<div class = 'teams_ml_graph_cum'></div>",
        controller: 'teamsMlGraphCtrl',
        replace: false
      }
    },

    nflScatter = function(){
      return {
        restrict: 'E',
        template: "<div class = 'nfl_scatter'></div>",
        controller: 'nflScatterCtrl',
        replace: false
      }
    },

    nflOu = function(){
      return {
        restrict: 'E',
        template: "<div>under construction</div>",
        controller: 'nflOuGraphCtrl',
        replace: false
      }
    },

    nflMl = function(){
      return {
        restrict: 'E',
        template: "<div>under construction</div>",
        controller: 'nflMlGraphCtrl',
        replace: false
      }
    },

    aggMl = function(){
      return {
        restrict: 'E',
        template: "<div></div>",
        controller: 'aggMlGraphCtrl',
        replace: false
      }
    },

    aggAts = function(){
      return {
        restrict: 'E',
        template: "<div> </div>",
        controller: 'aggAtsGraphCtrl',
        replace: false
      }
    },

    aggOu = function(){
      return {
        restrict: 'E',
        template: "<div> </div>",
        controller: 'aggOuGraphCtrl',
        replace: false
      }
    },

    aggFavs = function(){
      return {
        restrict: 'E',
        template: "<div class = 'agg_favs_graph'> the agg favs graph will go here'></div>",
        controller: 'aggFavsGraphCtrl',
        replace: false
      }
    },

    aggHome = function(){
      return {
        restrict: 'E',
        template: "<div class = 'agg_home_graph'> the agg ml graph will go here'></div>",
        controller: 'aggHomeGraphCtrl',
        replace: false
      }
    }


  // This maps the above variables to their own elements, so we can use "<chart></chart>"
  // to insert the pie.html into the element. This gives direction to our html and separates our concerns
  angular.module('Directives', [])
    .directive('footer', footer)
    // the graphs for individual teams
      .directive('teamsAts', teamsAts)
      .directive('teamsOu', teamsOu)
      .directive('teamsMl', teamsMl)
    // graphs for entire nfl
      .directive('nflScatter', nflScatter)
      .directive('nflOu', nflOu)
      .directive('nflMl', nflMl)
    // graphs for aggregates
      .directive("aggAts", aggAts)
      .directive("aggOu", aggOu)
      .directive("aggFavs", aggFavs)
      .directive("aggMl", aggMl)
      .directive("aggHome", aggHome)
    .directive('hed', hed)
    .directive('main', main)
    .directive('tableTeams', tableTeams)
    .directive('tableFavsDogs', tableFavsDogs)
    .directive('tableHomeAway', tableHomeAway)
}());

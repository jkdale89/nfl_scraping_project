'use strict';

angular.module('Services', ['ngResource'])

.service('Data', ['$http', '$exceptionHandler', function($http, $exceptionHandler) {
  var self = this;

// this should retrieve the merged "games" file, which has parsed and organized the results of the different games, with the lines
  self.gamesPromise = $http.get('data/aggregation/aggregate.json').then(function(data) {
    self.games = data.data;
    return self.games;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving games");
  });

}])

'use strict';

angular.module('Services', ['ngResource'])

.service('Data', ['$http', '$exceptionHandler', function($http, $exceptionHandler) {
  var self = this;

// this should retrieve the merged "games" file, which has parsed and organized the results of the different games, with the lines
  self.teamsPromise = $http.get('../working_data/teams.json').then(function(data) {
    self.teams = data.data;
    return self.teams;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving teams");
  });

  self.teamsMetaPromise = $http.get('../working_data/teams_meta.json').then(function(data) {
    self.teamsMeta = data.data;
    return self.teamsMeta;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving metadata on teams");
  });


}])

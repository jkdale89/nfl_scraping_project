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

  self.favoritesPromise = $http.get('../working_data/fav.json').then(function(data) {
    self.favorites = data.data;
    return self.favorites;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving favorite information");
  });

  self.underdogsPromise = $http.get('../working_data/dog.json').then(function(data) {
    self.underdogs = data.data;
    return self.underdogs;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving underdog information");
  });

  self.homeTeamsPromise = $http.get('../working_data/home.json').then(function(data) {
    self.home = data.data;
    return self.home;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving home information");
  });

  self.awayTeamsPromise = $http.get('../working_data/away.json').then(function(data) {
    self.away = data.data;
    return self.away;
  }, function(problem) {
    $exceptionHandler(problem, "retrieving away information");
  });



}])

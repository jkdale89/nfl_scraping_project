'use strict';

angular.module('Controllers', [])

  .controller('MainCtrl', ['$scope', '$routeParams', '$http', 'Data',
    function($scope, $routeParams, $http, data) {
      data.gamesPromise.then(function(data){
        $scope.games = data;
        return $scope.games;
      })
    }]);

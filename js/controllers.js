'use strict';

angular.module('Controllers', [])

  .controller('MainCtrl', ['$scope', '$routeParams', '$http', 'Data',
    function($scope, $routeParams, $http, data) {
      data.teamsPromise.then(function(data){
        $scope.teams = data;
        return $scope.teams;
      })
      data.teamsMetaPromise.then(function(data){
        $scope.teamsMeta = data;
        return $scope.teamsMeta;
      })
      data.homeTeamsPromise.then(function(data){
        $scope.home_teams = data;
        return $scope.home
      })
      data.awayTeamsPromise.then(function(data){
        $scope.away_teams = data;
        return $scope.away_teams;
      })
      data.underdogsPromise.then(function(data){
        $scope.underdogs = data;
        return $scope.underdogs;
      })
      data.favoritesPromise.then(function(data){
        $scope.favorites = data;
        return $scope.favorites;
      })
    $scope.cur_year = 2015;
    $scope.year_options = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
    $scope.cur_team = "Pittsburgh";
    $scope.activeTable = 'teams';

    $http.get("../working_data/teams_meta.json").then(function(data){
      $scope.team_options = Object.keys(data.data);
      $scope.ind = $scope.team_options.indexOf($scope.cur_team);
    })
    $scope.changeTeam = function(team){
      $scope.cur_team = team;
      $scope.ind = $scope.team_options.indexOf($scope.cur_team);
    }

    $scope.changeYear = function(year){
      $scope.cur_year = year;
    }

    $scope.teams_dropdown = false;
    $scope.year_dropdown = false;

    $scope.convertHex = function(hex,opacity){
      hex = hex.replace('#','');
      r = parseInt(hex.substring(0,2), 16);
      g = parseInt(hex.substring(2,4), 16);
      b = parseInt(hex.substring(4,6), 16);
      result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
      return result;
    }

  }])

  .controller('GraphControl', ['$scope', '$routeParams', '$http', 'Data', function($scope, $routeParams, $http, data){


    data.teamsPromise.then(function(data){
      $scope.teams = data;
      $scope.cur_season = $scope.teams[0]["Cleveland"][2015];
    })

    $http.get("../working_data/teams_meta.json").then(function(data){
      $scope.team_options = Object.keys(data.data);
      $scope.ind = $scope.team_options.indexOf($scope.cur_team);
    })

    $scope.$watch('cur_season', function(){

      var margin = {top: 20, right: 30, bottom: 40, left: 30},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
      var x = d3.scale.linear()
          .range([0, width]);
      var y = d3.scale.ordinal()
          .rangeRoundBands([0, height], 0.1);
      var xAxis = d3.svg.axis()
          .scale(x)
          .tickValues([-17,-14, -10, -7, -3, 0, 3, 7, 10, 14, 17])
          .orient("bottom");
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(0)
          .tickPadding(6);
      var svg = d3.select(".chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data = $scope.cur_season;

        x.domain(d3.extent(data, function(d) { return d.spread; })).nice();
        y.domain(data.map(function(d) { return d.week; }));
        svg.selectAll(".bar")
            .data(data)
          .enter().append("g").append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.spread < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(Math.min(0, d.spread)); })
            .attr("y", function(d) { return y(d.week); })
            .attr("width", function(d) { return Math.abs(x(d.spread) - x(0)); })
            .attr("height", y.rangeBand())
            .attr("stroke", "black")
            .attr("text", "hey");
        svg.selectAll("g").append("text")
          .text(function(d){return d.spread})
          .attr("text-align", "right")
          .attr("alignment-baseline", "middle")
          .attr("x", function(d){ return x(Math.min(0), d.spread); })
          .attr("y", function(d){ return y(d.week); });
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);





    //     d3.selectAll("rect").append("text")
    //       .text(function(d){return d.spread})
    //       .attr({
    //             "alignment-baseline": "middle",
    //             "text-anchor": "middle",
    //             "stroke": "black",
    //
    // })



      function type(d) {
        d.spread = +d.spread;
        return d;
      }



  })
}])


.controller('CarouselDemoCtrl', function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: 'http://lorempixel.com/' + newWidth + '/300',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }
});

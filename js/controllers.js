'use strict';

angular.module('Controllers', [])

  .controller('MainCtrl', ['$scope', '$rootScope', '$routeParams', '$http', 'Data',
    function($scope, $rootScope, $routeParams, $http, data) {
      data.teamsPromise.then(function(data){
        $rootScope.teams = data;
        return $rootScope.teams;
      })
      data.teamsMetaPromise.then(function(data){
        $rootScope.teamsMeta = data;
        return $rootScope.teamsMeta;
      })
      data.homeTeamsPromise.then(function(data){
        $rootScope.home_teams = data;
        return $rootScope.home
      })
      data.awayTeamsPromise.then(function(data){
        $rootScope.away_teams = data;
        return $rootScope.away_teams;
      })
      data.underdogsPromise.then(function(data){
        $rootScope.underdogs = data;
        return $rootScope.underdogs;
      })
      data.favoritesPromise.then(function(data){
        $rootScope.favorites = data;
        return $rootScope.favorites;
      })

      $rootScope.category_options = ["Teams", "Entire NFL", "Aggregates"];
      $rootScope.active_category = "Teams";
      $rootScope.active_type = "Against the Spread";

      $rootScope.changeActiveCategory = function(str){
        $rootScope.active_category = str;
        $rootScope.active_type = $rootScope.graph_options[$rootScope.category_options.indexOf($rootScope.active_category)].cat_types[0];
        return $rootScope.active_category
      };

      $rootScope.changeActiveType = function(str){
          $rootScope.active_type = str;
          return $rootScope.active_type;
      }

      $rootScope.graph_options = [
        {
          category: "Teams",
          cat_types: [
            "Against the Spread",
            "Over / Under",
            "Moneyline"
          ]
        },
        {
          category: "Entire NFL",
          //no space after
          cat_types: [
            "Favorites vs Underdogs",
            "Home vs Away",
            "Over / Under",
            "Moneyline"
          ]
        },
        {
          category: "Aggregates",
          cat_types: [
            "Moneylines",
            "Spread",
            "Over / Under",
            "Favorites vs Underdogs",
            "Home vs Away"
          ]
        }
      ];

      $rootScope.changeActiveCategory = function(str){
        $rootScope.active_category = str;
        return $rootScope.active_category
      };

      $rootScope.changeActiveType = function(str){
        $rootScope.active_type = str;
        return $rootScope.active_type;
      }

    $rootScope.cur_year = 2015;
    $rootScope.year_options = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
    $rootScope.cur_team = "Denver";
    $rootScope.activeTable = 'teams';

    $http.get("../working_data/teams_meta.json").then(function(data){
      $rootScope.team_options = Object.keys(data.data);
      $rootScope.ind = $rootScope.team_options.indexOf($rootScope.cur_team);
    })
    $rootScope.changeTeam = function(team){
      $rootScope.cur_team = team;
      $rootScope.ind = $rootScope.team_options.indexOf($rootScope.cur_team);
    }

    $rootScope.changeYear = function(year){
      $rootScope.cur_year = year;
    }

    $rootScope.teams_dropdown = false;
    $rootScope.year_dropdown = false;

    $rootScope.convertHex = function(hex,opacity){
      hex = hex.replace('#','');
      r = parseInt(hex.substring(0,2), 16);
      g = parseInt(hex.substring(2,4), 16);
      b = parseInt(hex.substring(4,6), 16);
      result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
      return result;
    }


  }])

.controller('teamsOuGraphCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $rootScope, $routeParams, $timeout, $http, db){

  $scope.changeActiveCategory = function(str){
    $scope.active_category = str;
    return $scope.active_category
  };

  $scope.changeActiveType = function(str){
    $scope.active_type = str;
    return $scope.active_type;
  }

  $scope.teams_dropdown = false;
  $scope.year_dropdown = false;
  $scope.cur_team = "Denver";
  $scope.cur_year = 2015;

  $scope.$watch("cur_season", function(){
    return $scope.cur_season;
  })

  db.teamsMetaPromise.then(function(data){
    $scope.teamsMeta = data;
    return $scope.teamsMeta;
  })

  $http.get("../working_data/teams_meta.json").then(function(data){
    $scope.team_options = Object.keys(data.data);
    $scope.ind = $scope.team_options.indexOf($scope.cur_team);
  })

  $scope.newOuChart = function(team){
    //first, let's fade out the old graph
    d3.selectAll("svg")
    .style("opacity", 0);

    //after the fade, we'll remove the element
    $timeout(function(){
      d3.selectAll("svg")
      .remove()
    }, 1)
    //then we'll repopulate with a new graph
    .then(function(){
      //don't run until we get our key variables
      $scope.cur_team = team;
      $scope.ind = $scope.team_options.indexOf($scope.cur_team);
      db.teamsPromise.then(function(data){
      $scope.teams = data;
      $scope.cur_season = $scope.teams[$scope.ind][$scope.cur_team][$scope.cur_year];
    })

    .then(function(){

      var margin = {top: 60, right: 30, bottom: 40, left: 250},
          width = 1200 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
      var x = d3.scale.linear()
          .range([0, width * .8]);
      var y = d3.scale.ordinal()
          .rangeRoundBands([0, height], 0.1);
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(0)
          .tickPadding(6);

          //what we are trying to add here...
          // turn old box green or red
          // show result against the spread in the box
          // outside box, in correct color, say if they covered or not

          //on hover, show green if covered
          // show red if no cover
          // text says

      var svg = d3.select(".teams_ou_graph")
          .append("svg")
          .style("opacity", 0)
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          d3.select('.chart')
            .append('text')
            .attr('transform', 'translate(120, 220)rotate(-90)')
            .attr({'id': 'yLabel', 'text-anchor': 'middle', "stroke": "#888", "font-size": '18', "stroke-width": '.5'})
            .text('Week');
          d3.select('.chart')
            .append('text')
            .attr('transform', 'translate(' + ((width) / 2) + ',' + (height + 100) + ')')
            .attr({'id': 'xLabel', 'text-anchor': 'middle', "stroke": "#eee", "font-size": '18', "stroke-width": '.5'})
            .text('Spread');
          // d3.select('.chart')
          //   .append('text')
          //   .attr('transform', 'translate(40, 60)')
          //   .attr({'font-size': '40', "fill": $scope.teamsMeta[$scope.cur_team].hex, "stroke": $scope.teamsMeta[$scope.cur_team].sec_hex})
          //   .text($scope.cur_team + " " + $scope.teamsMeta[$scope.cur_team].nick);


      // var data = $scope.cur_season;

      // it looks like our spread is doing some weird things - let's make sure it's + or - depending on
      // whether the .favorite property is true
      for(var i = 0; i < $scope.cur_season.length; i ++){
        $scope.cur_season[i].spread = Math.abs($scope.cur_season[i].spread);
        var joe = $scope.cur_season[i].favorite ? 1 : -1;
        $scope.cur_season[i].spread = $scope.cur_season[i].spread * joe;
      }

        x.domain([d3.min($scope.cur_season, function(d) { return d.spread - 3; }), d3.max($scope.cur_season, function(d) {return d.spread + 3})]);
        y.domain($scope.cur_season.map(function(d) { return d.week ? d.week : "BYE"; }));
        svg.selectAll(".bar")
            .data($scope.cur_season)
          .enter().append("g").append("rect")
            .attr("x", function(d) { return x(Math.min(0, d.spread)); })
            .attr("y", function(d) { return y(d.week); })
            .attr("width", function(d) { return Math.abs(x(d.spread) - x(0)); })
            .attr("height", y.rangeBand())
            .attr("stroke", function(d) { return d.spread < 0 ? $scope.teamsMeta[d.opponent].sec_hex : $scope.teamsMeta[$scope.cur_team].sec_hex})
            .attr("fill", function(d) { return d.spread < 0 ? $scope.teamsMeta[d.opponent].rgba : $scope.teamsMeta[$scope.cur_team].rgba})
            .on("mouseover", function(d){ console.log(d)});
        svg.selectAll("g").append("text")
          .text(function(d){return d.spread ? d.spread : ''})
          .attr("x", function(d){ return x(Math.min(0), d.spread); })
          .attr("y", function(d){ return y(d.week); })
          .attr("dy", "1.15em")
          .attr("dx", function(d){ return d.spread < 0 ? (x(d.spread) - x(0) + 5) : (x(d.spread) - x(0) - this.clientWidth - 10)})
          .attr("fill", "white");
        svg.selectAll("g").append("text")
          .text(function(d){return d.home ? "" + d.opponent : (d.home == false) ? "@ " + d.opponent : ""})
          .attr("x", function(d){ return x(Math.min(0), d.spread); })
          .attr("y", function(d){ return y(d.week); })
          .attr("dy", "1.15em")
          .attr("dx", function(d){ return d.spread < 0 ? (x(d.spread) - x(0) - this.clientWidth - 10) : (x(d.spread) - x(0) + 5)})
          .attr("fill", "black");
        svg.append("g")
            .attr("class", "x axis")
            .attr("stroke", "#aaa")
            .attr("stroke-width", ".5")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-20,0)")
            .attr("stroke", "#aaa")
            .attr("stroke-width", ".5")
            .attr("x", 0)
            .call(yAxis);

      function type(d) {
        d.spread = +d.spread;
        return d;
      }

    }).then(function(){
      d3.selectAll("svg")
        .style("opacity", 1)
      })
    })
  }

}])

.controller('teamsMlGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('nflFavsGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('nflHomeGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('nflOuGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('nflMlGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('aggAtsGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('aggOuGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('aggFavsGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('aggHomeGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('aggMlGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])



.controller('teamsAtsGraphCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $rootScope, $routeParams, $timeout, $http, db){

  $scope.changeActiveCategory = function(str){
    $scope.active_category = str;
    return $scope.active_category
  };

  $scope.changeActiveType = function(str){
    $scope.active_type = str;
    return $scope.active_type;
  }

  $scope.teams_dropdown = false;
  $scope.year_dropdown = false;
  $scope.cur_team = "Denver";
  $scope.cur_year = 2015;

  $scope.$watch("cur_season", function(){
    return $scope.cur_season;
  })

  db.teamsMetaPromise.then(function(data){
    $scope.teamsMeta = data;
    return $scope.teamsMeta;
  })

  $http.get("../working_data/teams_meta.json").then(function(data){
    $scope.team_options = Object.keys(data.data);
    $scope.ind = $scope.team_options.indexOf($scope.cur_team);
  })

  $scope.newChart = function(team){
    //first, let's fade out the old graph
    d3.selectAll("svg")
    .style("opacity", 0);

    //after the fade, we'll remove the element
    $timeout(function(){
      d3.selectAll("svg")
      .remove()
    }, 1)
    //then we'll repopulate with a new graph
    .then(function(){
      //don't run until we get our key variables
      $scope.cur_team = team;
      $scope.ind = $scope.team_options.indexOf($scope.cur_team);
      db.teamsPromise.then(function(data){
      $scope.teams = data;
      $scope.cur_season = $scope.teams[$scope.ind][$scope.cur_team][$scope.cur_year];
    })

    .then(function(){

      var margin = {top: 60, right: 30, bottom: 40, left: 250},
          width = 1200 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
      var x = d3.scale.linear()
          .range([0, width * .8]);
      var y = d3.scale.ordinal()
          .rangeRoundBands([0, height], 0.1);
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickSize(0)
          .tickPadding(6);

          //what we are trying to add here...
          // turn old box green or red
          // show result against the spread in the box
          // outside box, in correct color, say if they covered or not

          //on hover, show green if covered
          // show red if no cover
          // text says

      var svg = d3.select(".teams_ats_graph")
          .append("svg")
          .style("opacity", 0)
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          d3.select('.chart')
            .append('text')
            .attr('transform', 'translate(120, 220)rotate(-90)')
            .attr({'id': 'yLabel', 'text-anchor': 'middle', "stroke": "#888", "font-size": '18', "stroke-width": '.5'})
            .text('Week');
          d3.select('.chart')
            .append('text')
            .attr('transform', 'translate(' + ((width) / 2) + ',' + (height + 100) + ')')
            .attr({'id': 'xLabel', 'text-anchor': 'middle', "stroke": "#eee", "font-size": '18', "stroke-width": '.5'})
            .text('Spread');
          // d3.select('.chart')
          //   .append('text')
          //   .attr('transform', 'translate(40, 60)')
          //   .attr({'font-size': '40', "fill": $scope.teamsMeta[$scope.cur_team].hex, "stroke": $scope.teamsMeta[$scope.cur_team].sec_hex})
          //   .text($scope.cur_team + " " + $scope.teamsMeta[$scope.cur_team].nick);


      // var data = $scope.cur_season;

      // it looks like our spread is doing some weird things - let's make sure it's + or - depending on
      // whether the .favorite property is true
      for(var i = 0; i < $scope.cur_season.length; i ++){
        $scope.cur_season[i].spread = Math.abs($scope.cur_season[i].spread);
        var joe = $scope.cur_season[i].favorite ? 1 : -1;
        $scope.cur_season[i].spread = $scope.cur_season[i].spread * joe;
      }

        x.domain([d3.min($scope.cur_season, function(d) { return d.spread - 3; }), d3.max($scope.cur_season, function(d) {return d.spread + 3})]);
        y.domain($scope.cur_season.map(function(d) { return d.week ? d.week : "BYE"; }));
        svg.selectAll(".bar")
            .data($scope.cur_season)
          .enter().append("g").append("rect")
            .attr("x", function(d) { return x(Math.min(0, d.spread)); })
            .attr("y", function(d) { return y(d.week); })
            .attr("width", function(d) { return Math.abs(x(d.spread) - x(0)); })
            .attr("height", y.rangeBand())
            .attr("stroke", function(d) { return d.spread < 0 ? $scope.teamsMeta[d.opponent].sec_hex : $scope.teamsMeta[$scope.cur_team].sec_hex})
            .attr("fill", function(d) { return d.spread < 0 ? $scope.teamsMeta[d.opponent].rgba : $scope.teamsMeta[$scope.cur_team].rgba})
            .on("mouseover", function(d){ console.log(d)});
        svg.selectAll("g").append("text")
          .text(function(d){return d.spread ? d.spread : ''})
          .attr("x", function(d){ return x(Math.min(0), d.spread); })
          .attr("y", function(d){ return y(d.week); })
          .attr("dy", "1.15em")
          .attr("dx", function(d){ return d.spread < 0 ? (x(d.spread) - x(0) + 5) : (x(d.spread) - x(0) - this.clientWidth - 10)})
          .attr("fill", "white");
        svg.selectAll("g").append("text")
          .text(function(d){return d.home ? "" + d.opponent : (d.home == false) ? "@ " + d.opponent : ""})
          .attr("x", function(d){ return x(Math.min(0), d.spread); })
          .attr("y", function(d){ return y(d.week); })
          .attr("dy", "1.15em")
          .attr("dx", function(d){ return d.spread < 0 ? (x(d.spread) - x(0) - this.clientWidth - 10) : (x(d.spread) - x(0) + 5)})
          .attr("fill", "black");
        svg.append("g")
            .attr("class", "x axis")
            .attr("stroke", "#aaa")
            .attr("stroke-width", ".5")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-20,0)")
            .attr("stroke", "#aaa")
            .attr("stroke-width", ".5")
            .attr("x", 0)
            .call(yAxis);

      function type(d) {
        d.spread = +d.spread;
        return d;
      }

    }).then(function(){
      d3.selectAll("svg")
        .style("opacity", 1)
    })
    })
  }
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
})

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
        $rootScope.home = data;
        return $rootScope.home
      })
      data.awayTeamsPromise.then(function(data){
        $rootScope.away_teams = data;
        return $rootScope.away;
      })
      data.underdogsPromise.then(function(data){
        $rootScope.underdogs = data;
        return $rootScope.underdogs;
      })
      data.favoritesPromise.then(function(data){
        $rootScope.favorites = data;
        return $rootScope.favorites;
      })

      $http.get("../working_data/teams_meta.json").then(function(data){
        $rootScope.team_options = Object.keys(data.data);
        $rootScope.ind = $rootScope.team_options.indexOf($rootScope.cur_team);
      })

      $rootScope.cur_year = 2015;
      $rootScope.category_options = ["Entire NFL", "Aggregates"];
      $rootScope.active_category = "Entire NFL";
      $rootScope.active_type = "Favorites";
      $rootScope.year_options = [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];
      $rootScope.cur_team = "Denver";
      $rootScope.activeTable = 'teams';
      $rootScope.teams_dropdown = false;
      $rootScope.year_dropdown = false;
      $rootScope.showSecondary = false;
      $rootScope.before = true;
      $rootScope.graph_options = [
        {
          category: "Entire NFL",
          //no space after
          cat_types: [
            "Favorites",
            "Underdogs",
            "Home",
            "Away",
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
      ],
      $rootScope.margin = {top: 150, right: 20, bottom: 30, left: 120};
      $rootScope.width = 1060 - $rootScope.margin.left - $rootScope.margin.right;
      $rootScope.height = 750 - $rootScope.margin.top - $rootScope.margin.bottom;

    $rootScope.changeActiveCategory = function(str){
      $rootScope.active_category = str;
      $rootScope.active_type = $rootScope.graph_options[$rootScope.category_options.indexOf($rootScope.active_category)].cat_types[0];
      return $rootScope.active_category
    };

    $rootScope.changeActiveType = function(str){
        $rootScope.active_type = str;
        return $rootScope.active_type;
    }

    $rootScope.$watch("active_type", function(){
      $rootScope.active_type == 'Favorites' ? $rootScope.secondary = "Underdogs"
        :
      $rootScope.active_type == 'Underdogs' ? $rootScope.secondary = "Favorites"
        :
      $rootScope.active_type == 'Home' ? $rootScope.secondary = "Away"
        :
      $rootScope.active_type == 'Away' ? $rootScope.secondary = "Home" : ""
    });

    $rootScope.toggleSecondary = function(){
      $rootScope.showSecondary == true ?
      $rootScope.showSecondary = false
      :
      $rootScope.showSecondary = true;
    }

    $rootScope.changeTeam = function(team){
      $rootScope.cur_team = team;
      $rootScope.ind = $rootScope.team_options.indexOf($rootScope.cur_team);
    }

    $rootScope.changeYear = function(year){
      $rootScope.cur_year = year;
      return $rootScope;
    }

    $rootScope.convertHex = function(hex,opacity){
      hex = hex.replace('#','');
      r = parseInt(hex.substring(0,2), 16);
      g = parseInt(hex.substring(2,4), 16);
      b = parseInt(hex.substring(4,6), 16);
      result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
      return result;
    }

  }])

.controller('teamsMlGraphCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $rootScope, $routeParams, $timeout, $http, db){

  $scope.$watch("cur_season", function(){
    return $rootScope.cur_season;
  })

  db.teamsMetaPromise.then(function(data){
    $scope.teamsMeta = data;
    return $scope.teamsMeta;
  })

  $scope.newMlChart = function(team){
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
      $scope.cur_season = $scope.teams[$scope.ind][$scope.cur_team][$rootScope.cur_year];

    })




    .then(function(){

      var margin = {top: 20, right: 20, bottom: 30, left: 20},
      width = 960 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

      /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */


   for(var i = 0; i < $scope.cur_season.length; i++){
     $scope.cur_season[i].cum_earned = 0

     if( i == 0 ){
       if($scope.cur_season[i].ml < 0 && $scope.cur_season[i].winner == true){
         $scope.cur_season[i].cum_earned = 100;
       }
       else if($scope.cur_season[i].ml < 0 && $scope.cur_season[i].winner == false){
         $scope.cur_season[i].cum_earned = $scope.cur_season[i].ml;
       }
       else if($scope.cur_season[i].ml > 0 && $scope.cur_season[i].winner == true){
         $scope.cur_season[i].cum_earned = $scope.cur_season[i].ml;
       }
       else {
         $scope.cur_season[i].cum_earned = -100;
       }
       i++
     }
        // if we were favorites, and we won the game, add 100
        if($scope.cur_season[i].ml < 0 && $scope.cur_season[i].winner == true){
          $scope.cur_season[i].cum_earned = ($scope.cur_season[i-1].cum_earned || $scope.cur_season[i-2].cum_earned || 0) + 100;
        }
        else if($scope.cur_season[i].ml < 0 && $scope.cur_season[i].winner == false){
          $scope.cur_season[i].cum_earned = ($scope.cur_season[i-1].cum_earned || $scope.cur_season[i-2].cum_earned || 0) + $scope.cur_season[i].ml;
        }
        else if($scope.cur_season[i].ml > 0 && $scope.cur_season[i].winner == true){
          $scope.cur_season[i].cum_earned = ($scope.cur_season[i-1].cum_earned || $scope.cur_season[i-2].cum_earned || 0) + $scope.cur_season[i].ml;
        }
        else {
          $scope.cur_season[i].cum_earned = ($scope.cur_season[i-1].cum_earned || $scope.cur_season[i-2].cum_earned || 0) - 100;
        }
    }



  // setup x
  var xValue = function(d) { return d.week;}, // data -> value
      xScale = d3.scale.linear().range([0, $rootScope.width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

  var xCumValue = function(d) { return d},
      xCumMap = function(d) { return xScale(xCumValue(d));},
      xCumAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y 1 - for over / unders
  var yFavsValue = function(d) { return d.ml < 0 ? d.ml * -1 : "";}, // data -> value
      yFavsScale = d3.scale.linear().range([height, 0]), // value -> display
      yFavsMap = function(d) { return yFavsScale(yFavsValue(d));}, // data -> display
      yFavsAxis = d3.svg.axis().scale(yFavsScale).orient("left");

  // setup y 1 - for favorites
  var yDogsValue = function(d) { return d.ml > 0 ? (100 / (d.ml * 1)) * 100 : "";}, // data -> value
      yDogsScale = d3.scale.linear().range([height, 0]), // value -> display
      yDogsMap = function(d) { return yDogsScale(yDogsValue(d));}, // data -> display
      yDogsAxis = d3.svg.axis().scale(yDogsScale).orient("left");

      // setup y 2 - for favorites
  var yCumValue = function(d) { return d.cum_earned;}, // data -> value
      yCumScale = d3.scale.linear().range([height, 0]), // value -> display
      yCumMap = function(d) { return yCumScale(yCumValue(d));}, // data -> display
      yCumAxis = d3.svg.axis().scale(yCumScale).orient("left");

  var svg = d3.select(".teams_ml_graph_favs").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg2 = d3.select(".teams_ml_graph_dogs").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg3 = d3.select(".teams_ml_graph_cum").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([0, 16]);
    // set the domain to the range of ACTUALS
    yFavsScale.domain([100, d3.max($scope.cur_season, yFavsValue)]);
    yDogsScale.domain([0, 100]);
    yCumScale.domain([d3.min($scope.cur_season, yCumValue), d3.max($scope.cur_season, yCumValue)]);


    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Week");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yFavsAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "translate(0, 0)rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("$ risked to win 100");

    // draw dots
    svg.selectAll(".dot")
        .data($scope.cur_season)
        .enter().append("circle")
          .attr("class", "dot2")
          .attr("r", function(d){ return d.ml < 0 ? 6.5 : 0})
        .attr("cx", xMap)
        .attr("cy", yFavsMap)
        .style("fill", function(d) { return d.team ? $scope.teamsMeta[d.team].rgba : "" })
        // .style("fill", "rgba(00,00,00,.5)")
        .attr("cursor", "pointer")

        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Week");

        svg2.append("g")
            .attr("class", "y axis")
            .call(yDogsAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "translate(0, 0)rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("$ risked to win 100");

            svg2.selectAll(".dot")
                .data($scope.cur_season)
                .enter().append("circle")
                  .attr("class", "dot2")
                  .attr("r", function(d){ return d.ml > 0 ? 6.5 : 0})
                .attr("cx", xMap)
                .attr("cy", yDogsMap)
                .style("fill", function(d) { return d.team ? $scope.teamsMeta[d.team].rgba : "" })
                // .style("fill", "rgba(00,00,00,.5)")
                .attr("cursor", "pointer")

                svg3.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                  .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Week");

                svg3.append("g")
                    .attr("class", "y axis")
                    .call(yCumAxis)
                  .append("text")
                    .attr("class", "label")
                    .attr("transform", "translate(0, 0)rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("$ risked to win 100");

                    svg3.selectAll(".dot")
                        .data($scope.cur_season)
                        .enter().append("circle")
                          .attr("class", "dot2")
                          .attr("r", "6.5")
                          .attr("cx", xMap)
                        .attr("cy", yCumMap)

                        .style("fill", "green")
                        // .style("fill", "rgba(00,00,00,.5)")
                        .attr("cursor", "pointer");


      })

          .then(function(){
            d3.selectAll("svg")
              .style("opacity", 1)
            })
          })
        }


}])

.controller('nflScatterCtrl', ['$scope', '$routeParams', '$rootScope', '$timeout', '$http', 'Data', 'util', 'Axes',
  function($scope, $routeParams, $rootScope, $timeout, $http, db, util, Axes){

  db.underdogsPromise.then(function(data){
    $scope.underdogs = data;
  });

  db.homeTeamsPromise.then(function(data){
    $scope.home = data;
    console.log($scope.home[0]["2015"] + "is the home data");
  });

  db.awayTeamsPromise.then(function(data){
    $scope.away = data;
  });

  db.teamsMetaPromise.then(function(data){
    $scope.teamsMeta = data;
  });

  $scope.favorites = [];

  db.favoritesPromise.then(function(data){
    $scope.favorites = data;
    return $scope.favorites;
  });

  $rootScope.$watch("cur_year", function(){
    d3.selectAll("svg")
      .transition()
      .duration(500)
      .ease("linear")
      .attr("opacity", 0);
    $scope.newNflChart($rootScope.cur_year);

  });


  $rootScope.$watch("active_type", util.switchFade);

  $scope.newNflChart = function(startYear, type, team){


    //grab the current graph
    var graph = d3.selectAll("svg");
    //fade out the old graph
    util.fade(graph, "linear", 500, 0);
    // remove the old graph after fade ends
      $timeout(function(){
        d3.selectAll("svg").remove()
      }, 501)

    .then(function(){
      var
      // establish the data we are using
      joe_data = $scope.favorites[$rootScope.cur_year - $rootScope.year_options[0]][$rootScope.cur_year],

      change_data = function(){

        if($rootScope.active_type == 'Favorites'){
          joe_data = $rootScope.favorites[$rootScope.cur_year - $rootScope.year_options[0]][$rootScope.cur_year];
        }
        if($rootScope.active_type == 'Underdogs'){
          joe_data = $rootScope.underdogs[$rootScope.cur_year - $rootScope.year_options[0]][$rootScope.cur_year];
        }
        if($rootScope.active_type == 'Away'){
          joe_data = $rootScope.away[$rootScope.cur_year - $rootScope.year_options[0]][$rootScope.cur_year];
        }
        else if($rootScope.active_type == 'Home'){
          joe_data = $rootScope.home[$rootScope.cur_year - $rootScope.year_options[0]][$rootScope.cur_year];
        }
        return joe_data;
      };


      var svg = d3.select(".nfl_scatter").append("svg")
        .attr("width", $rootScope.width + $rootScope.margin.left + $rootScope.margin.right + 200)
        .attr("height", $rootScope.height + $rootScope.margin.top + $rootScope.margin.bottom + 50)
      .append("g")
        .attr("transform", "translate(" + $rootScope.margin.left + "," + $rootScope.margin.top + ")");

      util.editHeaderDesc($rootScope.active_category, $rootScope.active_type)
      util.editYearDesc($rootScope.cur_year);
      util.action_button.on("click", util.populate_games);

      Axes.xScale.domain([0, 16]);
      Axes.yScale.domain([-35, 35]);

      Axes.xAxis.tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
      Axes.yAxis.tickValues([-35, -28, -21, -17, -14, -10, -7, -3, 0, 3, 7, 10, 14, 17, 21, 28, 35]);

      Axes.init_x_axis("week", svg);
      Axes.init_y_axis("Spread", svg);

      var graph = svg.selectAll(".primary").data(change_data).enter().append("circle");

      // Initialize the graph
      util.initPrimary(graph, $rootScope.active_type, 8.5);
      // transition to spread coordinates
      util.fade(d3.selectAll("circle"), "elastic", 500, 1, Axes.yMapPrimary);

      d3.selectAll("circle")
        .on("mouseover", function(d){
          // grab the other side of the line
          util.highlightPartner(d);
          // grab this, make it bigger
          d3.select(this)
            .transition()
            .ease("elastic")
            .duration("500")
            .attr("r", "12.5")
            .attr("fill", function(d){return $rootScope.teamsMeta[d.primaryTeam].hex})
            .attr("stroke", function(d){return $rootScope.teamsMeta[d.primaryTeam].sec_hex});
          //populate the spread box
          util.fill_spread(util.spread_label, d);
          //fade in the spread box
          util.fade(util.spread_label, "elastic", "500", 1);
        })
        .on("click", function(d){
          // move the partner to results y coordinate
          d3.selectAll("." + util.stringify(d))
            .transition()
            .ease("elastic")
            .duration("1000")
            .attr("fill", function(d){ return d.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
            .attr("stroke", function(d){ return d.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
            .attr("cy", Axes.yMapAts);
          // move this to the results y coordinate
          d3.select(this)
            .transition()
            .ease("elastic")
            .duration("1000")
            .attr("fill", function(d){ return d.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
            .attr("stroke", function(d){ return d.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
            .attr("cy", Axes.yMapAts);
          //populate the result
          util.fill_result(util.result_label, d);
          //fade out the spread
          util.fade(util.spread_label, "elastic", 500, .3);
          //fade in the result
          util.fade(util.result_label, "elastic", 500, 1);
        })
        .on("mouseout", function(d){
          // fade out game
          util.fade(util.spread_label, "elastic", 500, 0);
          d3.select(this)
            .transition()
            .ease("elastic")
            .duration("300")
            .attr("r", "8.5");
        
          });
          svg.selectAll(".secondary")
            .data(change_data)
              .enter().append("circle")
              .attr("class", $rootScope.secondary)
              .attr("r", function(d){ return d.spread ? 5.5 : 0})
              .attr("stroke-width", "3")
              .attr("cx", Axes.xMap)
              .attr("cy", Axes.yMapSecondary())
              .attr("opacity", "0")
              .attr("fill", function(d){return $rootScope.teamsMeta[d.secondaryTeam].hex})
              .attr("cursor", "pointer");
          $rootScope.$watch("showSecondary", function(){
            var hey = d3.selectAll("." + $rootScope.secondary);
            if($rootScope.showSecondary == true){
              hey.transition().duration(500).attr("opacity", ".3")
            }
            else if($rootScope.showSecondary == false){
              hey.transition().duration(500).attr("opacity", "0")
            }
        })
    })
  }
}])

.controller('nflOuGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

.controller('nflMlGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

}])

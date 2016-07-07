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
      $rootScope.active_category = "Entire NFL";
      $rootScope.active_type = "Scatter";

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
            "Scatter",
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
      return $rootScope;
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
      $scope.cur_season = $scope.teams[$scope.ind][$scope.cur_team][$rootScope.cur_year];
    })

    .then(function(){

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  // setup x
  var xValue = function(d) { return d.week;}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y 1 - for over / unders
  var yValue = function(d) { return d.total;}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup y 2 - for actuals

  // setup y 1 - for over / unders
  var yyValue = function(d) { return (d.total + d.over_differential)}, // data -> value
      yyMap = function(d) { return yScale(yyValue(d));}; // data -> display


  // setup fill color
  // var cValue = function(d) { return d.Manufacturer;},
  //     color = d3.scale.category10();

  // add the graph canvas to the body of the webpage
  var svg = d3.select(".teams_ou_graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min($scope.cur_season, xValue)- 1, d3.max($scope.cur_season, xValue)+1]);
    // set the domain to the range of ACTUALS
    yScale.domain([d3.min($scope.cur_season, yyValue) + 3, d3.max($scope.cur_season, yyValue) - 3]);

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
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Over / Under");

    // draw dots
    svg.selectAll(".dot")
        .data($scope.cur_season)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){ return d.total ? 9.5 : 0})
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return d.team ? $scope.teamsMeta[d.team].rgba : "" })
        // .style("fill", "rgba(00,00,00,.5)")
        .attr("cursor", "pointer");
        // var tooltip = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);
        // function(d) { return color(cValue(d));})
        // .on("mouseover", function(d) {
        //     tooltip.transition()
        //          .duration(200)
        //          .style("opacity", .9);
        //     tooltip.html(d.opponent + "<br/> " + d.team)
        //          .style("left", (d3.event.pageX + 5) + "px")
        //          .style("top", (d3.event.pageY - 28) + "px");
        // })
        // .on("mouseout", function(d) {
        //     tooltip.transition()
        //          .duration(500)
        //          .style("opacity", 0)
        //        })

    svg.selectAll(".dot2")
        .data($scope.cur_season)
      .enter().append("circle")
        .attr("class", "dot2")
        .attr("r", function(d){ return d.total ? 6.5 : 0})
        .attr("cx", xMap)
        .attr("cy", yyMap)
        .style("fill", function(d){ return d.over_differential > 0 ? 'rgba(00,150,00,.85)' : d.over_differential == 0? 'rgba(255,255,255,1)' : 'rgba(255,00,00,.6)'});
        // function(d) { return color(cValue(d));})
        // .on("mouseover", function(d) {
        //     tooltip.transition()
        //          .duration(200)
        //          .style("opacity", .9);
        //     tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
  	    //     + ", " + yValue(d) + ")")
        //          .style("left", (d3.event.pageX + 5) + "px")
        //          .style("top", (d3.event.pageY - 28) + "px");
        // })
        // .on("mouseout", function(d) {
        //     tooltip.transition()
        //          .duration(500)
        //          .style("opacity", 0);
  })

  // function type(d) {
  //   d.date = formatDate.parse(d.date);
  //   d.close = +d.close;
  //   return d;
  // }


          .then(function(){
            d3.selectAll("svg")
              .style("opacity", 1)
            })
          })
        }

}])

.controller('teamsMlGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

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
      $scope.cur_season = $scope.teams[$scope.ind][$scope.cur_team][$scope.cur_year];

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
      xScale = d3.scale.linear().range([0, width]), // value -> display
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

.controller('nflScatterCtrl', ['$scope', '$routeParams', '$rootScope', '$timeout', '$http', 'Data', function($scope, $routeParams, $rootScope, $timeout, $http, db){

  db.underdogsPromise.then(function(data){
    $scope.underdogs = data;
  });

  db.homeTeamsPromise.then(function(data){
    $scope.home = data;
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

  $scope.$watch("favorites", function(){
    $scope.newNflChart(2015);
  });

  $scope.newNflChart = function(startYear, endYear, type){
    d3.selectAll("svg")
      .style("opacity", 0);

      $timeout(function(){
        d3.selectAll("svg")
        .remove()
      }, 1)

      .then(function(){

        console.log($scope.favorites.length + "is the length of favorites");

        $rootScope.cur_year = startYear;
        if(endYear){
          $scope.duration = endYear - startYear + 1;
        }
        else{
          $scope.duration = 1;
        }
        if(type){
          $scope.filter = type;
        }
        else{
          $scope.filter = null;
        }
      })

      .then(function(){
        var margin = {top: 100, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 580 - margin.top - margin.bottom;

        var xValue = function(d){ return d.week},
            xScale = d3.scale.linear().range([0, width]),
            xMap = function(d) { return xScale(xValue(d));},
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        var yValueF = function(d) { return d.spread * -1},
            yScale = d3.scale.linear().range([height, 0]),
            yMapF = function(d) { return yScale(yValueF(d));},
            yAxis = d3.svg.axis().scale(yScale).orient("left");

            var yValueD = function(d) {return d.spread},
            yMapD = function(d) { return yScale(yValueD(d));}

        var svg = d3.select(".nfl_scatter").append("svg")
          .attr("width", width + margin.left + margin.right + 50)
          .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          xScale.domain([0, 16]);
          yScale.domain([-21, 21]);

          xAxis.tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
          yAxis.tickValues([-21, -17, -14, -10, -7, -3, 0, 3, 7, 10, 14, 17, 21]);

          var tooltip = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 1);

          // .on("mouseover", function(d) {
          //     tooltip.transition()
          //          .duration(200)
          //          .style("opacity", .9);
          //     tooltip.html(d.opponent + "<br/> " + d.team)
          //          .style("left", (d3.event.pageX + 5) + "px")
          //          .style("top", (d3.event.pageY - 28) + "px");
          // })
          // .on("mouseout", function(d) {
          //     tooltip.transition()
          //          .duration(500)
          //          .style("opacity", 0)
          //        })

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height / 2 + ")")
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
                .call(yAxis)
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Over / Under");

            svg.selectAll(".dotFavorite")
              .data($scope.favorites[$rootScope.cur_year - 2006][$rootScope.cur_year])
                  .enter().append("circle")
                    .attr("class", function(d)
                      {return d.dog.replace(" ","").replace(".","") + d.week
                      + " " + "week_" + d.week
                      })
                    .attr("r", function(d){ return d.spread ? 5.5 : 0})
                    .attr("stroke-width", "3")
                    .attr("cx", xMap)
                    .attr("cy", yMapF)
                    .attr("fill", "rgba(0,200,50,1)")
                    // .style("fill", function(d){ return $scope.teamsMeta[d.fav].hex})
                    // .style("fill", "rgba(00,00,00,.5)")
                    .attr("cursor", "pointer")
                    .on("mouseover", function(d){
                        // select data from this week
                        d3.selectAll(".week_" + d.week)
                        //on hover, fade out the data, make it small and green
                          .transition()
                          .ease("elastic")
                          .duration("500")
                          .attr("r", "5.5")
                          .attr("z-index", "0")
                          .attr("fill", "rgba(0,200,50,1)")
                          .attr("stroke", "rgba(0,200,50,1)")

                        d3.selectAll("." + d.dog.replace(" ","").replace(".","") + d.week)
                          .transition()
                          .ease("elastic")
                          .duration("500")
                          .attr("z-index", "1")
                          .attr("r", "12.5")
                          .attr("fill", function(d){ return $scope.teamsMeta[d.dog].hex})
                          .attr("stroke", function(d){return $scope.teamsMeta[d.dog].sec_hex})
                          .attr("opacity", "1");
                        d3.select(this)
                          .transition()
                          .ease("elastic")
                          .duration("500")
                          .attr("r", "12.5")
                          .attr("z-index", "1")
                          .attr("fill", function(d){return $scope.teamsMeta[d.fav].hex})
                          .attr("stroke", function(d){return $scope.teamsMeta[d.fav].sec_hex});

                        tooltip.transition()
                          .duration(200)
                          .ease("elastic")
                        tooltip.html(d.fav + "<br/> " + d.ats + "<br/>" + d.dog)
                          .style("left", (d3.event.pageX + 25) + "px")
                          .style("top", (d3.event.pageY - 8) + "px");
                    })
                    .on("mouseout", function(d){
                        d3.selectAll(".week_" + d.week)
                        .transition()
                        .ease("elastic")
                        .attr("stroke-width", "3")
                        .duration("100")
                        .attr("r", 5.5)
                        .attr("opacity", "1")
                        .attr("fill", "rgba(0,200,50,1)");

                        d3.selectAll("." + d.dog.replace(" ","").replace(".","") + d.week)
                        .transition()
                        .ease("elastic")
                        .attr("stroke-width", "3")
                        .duration("100")
                        .attr("r", 5.5)
                        .attr("opacity", "1");

                        d3.select(this)
                          .transition()
                          .ease("elastic")
                          .duration("100")
                          .attr("r", "5.5")
                          .attr("fill", "rgba(0,200,50,1)")
                          .attr("stroke", "rgba(0,200,50,1)")
                          .attr("opacity", "1");


                    });

                    svg.selectAll(".dotUnderdog")
                    .data($scope.favorites[$rootScope.cur_year - 2006][$rootScope.cur_year])
                        .enter().append("circle")
                          .attr("class", function(d){
                            return d.dog.replace(" ","").replace(".","") + d.week})
                          .attr("r", function(d){ return d.spread ? 5.5 : 0})
                          .attr("stroke-width", "3")
                          .attr("cx", xMap)
                          .attr("cy", yMapD)
                          .attr("fill", "rgba(150,0,150,1)")
                          // .style("fill", "rgba(00,00,00,.5)")
                          .attr("cursor", "pointer");
      })


  }


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

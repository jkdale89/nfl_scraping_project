'use strict';

angular.module('Services', ['ngResource'])

.service('util', ['$exceptionHandler', 'Axes', '$rootScope', function($exceptionHandler, Axes, $rootScope){
  var self = this,
  //margin for the top header
    m_top = 70,
    //margin for the left
    m_title = 100,
    m_year = 950;


  self.fade = function(obj, animation, speed, opa, yCoord){
    obj.transition()
    .ease(animation)
    .duration(speed)
    .style("opacity", opa)
    .attr("cy", yCoord)
  }

  self.initPrimary = function(obj, type, size, team){

    obj
      .attr("class", function(d){self.stringify(d) + " " + type})
      .attr("r", function(d){ return d.spread && ($rootScope.team_filter? d.primaryTeam == team : true) ? size : 0})
      .attr("stroke-width", "1.5")
      .attr("cx", Axes.xMap)
    //Init at the y axis, in order to animate up
      .attr("cy", Axes.yScale(0))
      .attr("opacity", "1")
      .attr("fill", function(d){return $rootScope.teamsMeta[d.primaryTeam].hex})
      .attr("stroke", function(d){return $rootScope.teamsMeta[d.primaryTeam].sec_hex})
      .attr("cursor", "pointer");
  };

  self.filterTeam = function(team){
    if($rootScope.team_filter == true){
      d3.selectAll('circle')
      .attr("r", function(d){return d.primaryTeam == team ? 9.5 : ""})
    }
  };

  //transition this to the result
  self.trans_result = function(data){
    var sel = d3.selectAll("." + data.secondaryTeam.replace(" ","").replace(".","") + data.week);
    sel.transition()
    .ease("elastic")
    .duration("1000")
    .attr("fill", function(data){ return data.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
    .attr("stroke", function(data){ return data.ats > 0 ? "rgb(00,200,100)" : "rgb(150,0,0)"})
  }


  self.fill_spread = function(obj, data){
    obj.html(
      "<span> Spread: " + (data.home ? '@ ' : '') + "<img src=" + $rootScope.teamsMeta[data.primaryTeam].url + ">" + "<span> " + data.spread + " vs </span><span>" +
      (!data.home ? '@ ' : '') + "<img src=" + $rootScope.teamsMeta[data.secondaryTeam].url + ">" + " " + "</span><span>")
    .style("right", "13%")
    .style("top", "3.5%")
  }

  self.fill_result = function(obj, data){
    obj.html("<span> Result: " + (data.home ? '@ ' : '') + "<img src=" + $rootScope.teamsMeta[data.winningTeam].url + " alt=" + data.winingTeam + ">" + ": </span><span> " + data.winningScore +",</span><span> " +
    "<span>" + (!data.home ? '@ ' : '') + "<img src=" + $rootScope.teamsMeta[data.losingTeam].url +  " alt=" + data.losingTeam + ">" +  ": " + data.losingScore + "</span>" +
    "<span> (" + data.ats + ")</span>")
    .style("right", "13%")
    .style("top", "7.5%")
  }

  // self.editYearDesc = function(year){
  //   d3.select("svg").append("text")
  //   .text(year)
  //   .attr("font-size", "60px")
  //   .attr("stroke", "rgb(221,221,221)")
  //   .attr("opacity", ".3")
  //   .attr("y", m_top)
  //   .attr("x", m_year);
  // };

  self.stringify = function(obj){
      var n_str = obj.secondaryTeam.replace(" ","").replace(".","") + obj.week;
      return n_str;
    };

  // populates the lines
  self.populate_games = function(graph){
    if($rootScope.graphStatus == "lines"){
      d3.selectAll("circle")
      .transition()
      .duration(2000)
      .ease("elastic")
      .attr("fill", function(d){return d.ats > 0 ? "green" : "red"})
      .attr("stroke", function(d){return d.ats > 0 ? "green" : "red"})
      .attr("cy", Axes.yMapAts)
      .attr("opacity", 1)
      .delay(function(d,i){return 100 + 25 * d.week + i * 5});
      $rootScope.graphStatus = "results";
    }
    else if($rootScope.graphStatus == 'results'){
      d3.selectAll("circle")
      .transition()
      .duration(1000)
      .ease("linear")
      .attr("opacity", .15);
      $rootScope.graphStatus = "trend";
    }
    else if($rootScope.graphStatus == 'trend'){
      d3.selectAll("circle")
      .transition()
      .duration(2000)
      .ease("elastic")
      .attr("fill", function(d){return $rootScope.teamsMeta[d.primaryTeam].hex})
      .attr("stroke", function(d){return $rootScope.teamsMeta[d.primaryTeam].sec_hex})
      .attr("cy", Axes.yMapPrimary)
      .attr("opacity", 1)
      .delay(function(d,i){return 100 + 25 * d.week + i * 5});
      $rootScope.graphStatus = "lines";
    }
  }
  // self.populate_primary = function(type //fav, dog, home, away)

  self.highlightPartner = function(obj){
    d3.selectAll("." + obj.secondaryTeam.replace(" ","").replace(".","") + obj.week)
    .transition()
    .ease("elastic")
    .duration("500")
    .attr("z-index", "1")
    .attr("r", "12.5")
    .attr("fill", function(d){ return $rootScope.teamsMeta[obj.secondaryTeam].hex})
    .attr("stroke", function(d){return $rootScope.teamsMeta[obj.secondaryTeam].sec_hex})
    .attr("opacity", "1")
  };

  self.action_button = d3.select("body").append("div")
    .html(
      "<div class='area_chart'>" +
        "<i class = 'fa fa-area-chart'></i>" +
      "</div>"
    );

    self.play_button = d3.select("body").append("div")
      .html(
        "<div class='play_button'>" +
        "<i class = 'fa fa-play-circle'></i>" +
        "</div>"
      );

  self.spread_label = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", "0");

  self.result_label =  d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", "0");

  self.switchFade = function(type){
    // console.log("the active type is " + type);
    // OBVIOUSLY REFACTOR THIS. am shitty code writing
    if(type == 'Underdogs'){
      d3.selectAll("circle")
        .transition()
        .ease("linear")
        .duration(300)
        .attr("opacity", .1);

      d3.selectAll(".Underdogs")
        .transition()
        .ease("linear")
        .duration(300)
        .attr("opacity", 1);
      }

      if(type == 'Favorites'){
        d3.selectAll("circle")
          .transition()
          .ease("linear")
          .duration(300)
          .attr("opacity", .1);

        d3.selectAll(".Favorites")
          .transition()
          .ease("linear")
          .duration(300)
          .attr("opacity", 1);
        }
      };



}])

.service("Axes", ['$http', '$rootScope', function($http, $rootScope){
  var self = this,
      shift_left = 1,
      slope_multiplier = .10;

  self.xScale = d3.scale.linear().range([0, $rootScope.width]);
  self.xAxis = d3.svg.axis().scale(self.xScale).orient("bottom");
  self.xValue = function(d){ return d.week};
  self.xMap = function(d) { return self.xScale(self.xValue(d) - shift_left + ((1 - d.spread) * slope_multiplier));};


  self.yScale = d3.scale.linear().range([$rootScope.height, 0]);
  self.yAxis = d3.svg.axis().scale(self.yScale).orient("left");

  self.yScaleRight = d3.scale.linear().range([$rootScope.height, 0]);
  self.yAxisSec = d3.svg.axis().scale(self.yScaleRight).orient("right");






  // y favorites utilities
  self.yValueFav = function(d) { return d.spread * -1};
  self.yMapFav = function(d) {return self.yScale(self.yValueFav(d));};

  self.yValueFavSecondary = function(d){ return d.spread};
  self.yMapFavSecondary = function(d){return self.yScale(self.yValueFavSecondary(d))};
  // y dog mapping
  self.yValueDog = function(d) {return d.spread * -1};
  self.yMapDog = function(d) {return self.yScale(self.yValueDog(d));};

  self.yValueDogSecondary = function(d){return d.spread};
  self.yMapDogSecondary = function(d) {return self.yScale(self.yValueDogSecondary(d));};

  // y home mapping
  self.yValueHome = function(d){return d.spread * -1};
  self.yMapHome = function(d){return self.yScale(self.yValueHome(d))};

  self.yValueHomeSecondary = function(d){return d.spread};
  self.yMapHomeSecondary = function(d){return self.yScale(self.yValueHomeSecondary(d));}
  // y away mapping
  self.yValueAway = function(d){return d.spread * -1};
  self.yMapAway = function(d){return self.yScale(self.yValueAway(d))};

  self.yValueAwaySecondary = function(d){return d.spread};
  self.yMapAwaySecondary = function(d){return self.yScale(self.yValueAwaySecondary(d));}
  // y results mapping
  self.yValueAts = function(d){return (d.spread * -1) + d.ats};
  self.yMapAts = function(d){ return self.yScale(self.yValueAts(d))};


  self.yMapPrimary = function(d){
    if($rootScope.active_type == 'Favorites'){
      return self.yMapFav(d)
    }
    else if($rootScope.active_type == 'Underdogs')
    {
      return self.yMapDog(d)
    }
    else if($rootScope.active_type == 'Away'){
      return self.yMapAway(d)
    }
    else if($rootScope.active_type == 'Home'){
      return self.yMapHome(d);
    }
  };

  self.yMapSecondary = function(){
    if($rootScope.active_type == 'Favorites'){
      return self.yMapDogSecondary;
    }
    else if($rootScope.active_type == 'Underdogs'){
      return self.yMapFavSecondary;
    }
    else if($rootScope.active_type == 'Home'){
      return self.yMapAwaySecondary;
    }
    else if($rootScope.active_type == 'Away'){
      return self.yMapHomeSecondary;
    };
  };

  // x-axis
  self.init_x_axis = function(name, graph){
    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + $rootScope.height / 2 + ")")
      .call(self.xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", $rootScope.width / 2)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(name);
  };

  // y-axis
  self.init_y_axis = function(name, graph){
    graph.append("g")
        .attr("class", "y axis")
        .call(self.yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(name);
  }

  self.init_sec_y_axis = function(name, graph){
    graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(950)")
        .attr("fill", "rgba(00,00,00,.3)")
        .call(self.yAxisSec)
      .append("text")
        .attr("class", "label")
        .attr("transform", "translate(-20)rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(name);
  }

}])

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

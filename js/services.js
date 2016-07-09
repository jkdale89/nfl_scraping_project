'use strict';

angular.module('Services', ['ngResource'])

.service('util', ['$exceptionHandler', '$rootScope', function($exceptionHandler, $rootScope){
  var self = this,
  //margin for the top header
    m_top = 50,
    //margin for the left
    m_title = 100,
    m_year = 950;


  self.editHeaderDesc = function(category, subCategory) {
    d3.select("svg").append("text")
      .text(category + ": " + subCategory)
      .attr("font-size", "60px")
      .attr("stroke", "rgb(221,221,221)")
      .attr("opacity", ".3")
      .attr("y", m_top)
      .attr("x", m_title);
  };

  self.fadeIn = function(obj, animation, speed, opa){
    obj.transition()
    .ease(animation)
    .duration(speed)
    .style("opacity", opa)
  }

  self.editYearDesc = function(year){
    d3.select("svg").append("text")
    .text(year)
    .attr("font-size", "60px")
    .attr("stroke", "rgb(221,221,221)")
    .attr("opacity", ".3")
    .attr("y", m_top)
    .attr("x", m_year);
  };

  // populates the lines
  self.populate_games = function(graph){
    d3.selectAll("circle")
    .transition()
    .duration(500)
    .ease("linear")
      .attr("opacity", 0);

    d3.selectAll("circle")
      .transition()
        .duration(500)
        .ease("linear")
        .delay(function(d,i){
          return 500 + 100 * d.week + i * 5})
          .attr("opacity", 1)
  };


  // self.populate_primary = function(type //fav, dog, home, away)

  self.highlightPartner = function(obj){
    d3.selectAll("." + obj.dog.replace(" ","").replace(".","") + obj.week)
    .transition()
    .ease("elastic")
    .duration("500")
    .attr("z-index", "1")
    .attr("r", "12.5")
    .attr("fill", function(d){ return $rootScope.teamsMeta[obj.dog].hex})
    .attr("stroke", function(d){return $rootScope.teamsMeta[obj.dog].sec_hex})
    .attr("opacity", "1")
  };


  self.play_button = d3.select("body").append("div")
    .html(
      "<div class='area_chart'>" +
      "<i class = 'fa fa-area-chart'></i>" +
      "</div>"
    );

  self.results_button = d3.select("body").append("div")
    .html(
      "<div class='line_chart'>" +
      "<i class = 'fa fa-line-chart'></i>" +
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

.service("Axes", ['$http', function($http){
  var self = this,
  margin = {top: 100, right: 20, bottom: 30, left: 120},
  width = 1060 - margin.left - margin.right,
  height = 680 - margin.top - margin.bottom,

  xScale = d3.scale.linear().range([0, width]),
  xAxis = d3.svg.axis().scale(xScale).orient("bottom"),

  yScale = d3.scale.linear().range([height, 0]),
  yAxis = d3.svg.axis().scale(yScale).orient("left");

  xScale.domain([0, 16]);
  yScale.domain([-35, 35]);

  xAxis.tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  yAxis.tickValues([-35, -28, -21, -17, -14, -10, -7, -3, 0, 3, 7, 10, 14, 17, 21, 28, 35]);

  self.init_x_axis = function(name, graph){
    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height / 2 + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width / 2)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(name);
  };

  xScale.domain([0, 16]);
  yScale.domain([-35, 35]);

  xAxis.tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  yAxis.tickValues([-35, -28, -21, -17, -14, -10, -7, -3, 0, 3, 7, 10, 14, 17, 21, 28, 35]);

  // y-axis
  self.init_y_axis = function(name, graph){
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
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

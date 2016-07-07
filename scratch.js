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

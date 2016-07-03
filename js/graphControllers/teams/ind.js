angular.module("betweenTheLines.controllers")

.controller('teamGraphCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'Data', function($scope, $routeParams, $timeout, $http, db){

  $scope.active_category = "Teams";
  $scope.active_type = "Against the Spread";
  $scope.active_graph = 'teamGraph';

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

      var svg = d3.select(".team_graph")
          .append("svg")
          .style("opacity", 0)
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + 50)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          d3.select('.chart')
            .append('text')
            .attr('transform', 'translate(-120, 220)rotate(-90)')
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
}]);

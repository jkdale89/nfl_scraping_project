var fs = require('fs'),
    results = require("./js/clean_results.js"),
    lines = require("./js/clean_lines.js"),
    aggregate = [],
    teamsList = [];

    for(var i = 0; i < results.length; i ++) {
      if(teamsList.indexOf(results[i].awayTeam)){
        i++
      }
      else {
        teamsList.push(results[i].awayTeam)
      }
    }
    console.log(teamsList)

    // for(var i = 0; i < lines.length; i ++) {
    //   var id = lines[i].idj;
    //   for(var j = 0; j < results.length; j ++){
    //     if (id === results[j].idj) {
    //       lines[i].winner = results[j].winner;
    //       lines[i].loser = results[j].loser;
    //       lines[i].winningScore = results[j].winningScore;
    //       lines[i].losingScore = results[j].losingScore;
    //     }
    //   }
    //   aggregate.push(lines[i]);
    // }

  fs.writeFile("aggregate.json", JSON.stringify(aggregate, null, 6), function(err) {
      console.log("check aggreagate.json for the output.")
  });

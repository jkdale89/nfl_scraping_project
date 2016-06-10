var fs = require("fs");
var lines = require("../exports/clean_lines_edited.js");
var results = require("../exports/clean_results.js");
var teams_key = require("../exports/teams_key.js");
var aggregate = [];

var test =
  function(){
    for(var i = 0; i < lines.length; i ++) {
      for(var k = 0; k < lines[i].length; k++){
        for(var l = 0; l < lines[i][k].length; l++){
          // set a variable that can serve as unique ID for games
          var id = lines[i][k][l].id_match;
          var id_alt = lines[i][k][l].id_match_alt;
          for(var j = 0; j < results.length; j ++){
            // if the id of the lines === id of results, merge data
            if (id === results[j].idj || id_alt == results[j].idj) {
              lines[i][k][l].winner = teams_key[results[j].winner];
              lines[i][k][l].loser = teams_key[results[j].loser];
              lines[i][k][l].winningScore = results[j].winningScore;
              lines[i][k][l].losingScore = results[j].losingScore;
              // if the underdog won, or if the underdog lost by less than the spread, the underdog covered.
              lines[i][k][l].winner_ats =
                lines[i][k][l].dog === lines[i][k][l].winner ?  lines[i][k][l].dog :
                  ((lines[i][k][l].losingScore - lines[i][k][l].spread) > lines[i][k][l].winningScore)
                  ? lines[i][k][l].dog : lines[i][k][l].fav,
              // the loser ATS is the team that didn't cover...
              lines[i][k][l].loser_ats =
                lines[i][k][l].winner_ats === lines[i][k][l].fav ? lines[i][k][l].dog : lines[i][k][l].fav,
                lines[i][k][l].fav_diff_ats =
                  (lines[i][k][l].fav === lines[i][k][l].winner) ?
                    lines[i][k][l].winningScore - lines[i][k][l].losingScore + lines[i][k][l].spread
                    :
                    lines[i][k][l].losingScore - lines[i][k][l].winningScore + lines[i][k][l].spread,
                lines[i][k][l].dog_diff_ats = (-1 * lines[i][k][l].fav_diff_ats),
                lines[i][k][l].over = ((lines[i][k][l].winningScore + lines[i][k][l].losingScore) > lines[i][k][l].total) ?
                  true
                  :
                  false,
                lines[i][k][l].over_differential = (lines[i][k][l].winningScore + lines[i][k][l].losingScore - lines[i][k][l].total)

              }
            }
            aggregate.push(lines[i][k][l]);
            }
        }
      }
      fs.writeFile("aggregate.js", "module.exports = " + JSON.stringify(aggregate, 6, "\t"), function(){
        console.log("check aggregate.js for output");
      })
    }



test();

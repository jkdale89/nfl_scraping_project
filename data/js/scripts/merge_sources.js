module.exports = {
  merge: function(){
    for(var i = 0; i < lines.length; i ++) {
      // set a variable that can serve as unique ID for games
      var id = lines[i].idj;
      for(var j = 0; j < results.length; j ++){
        // if the id of the lines === id of results, merge data
        if (id === results[j].idj) {
          lines[i].winner = teams_key[results[j].winner];
          lines[i].loser = teams_key[results[j].loser];
          lines[i].winningScore = results[j].winningScore;
          lines[i].losingScore = results[j].losingScore;
          // if the underdog won, or if the underdog lost by less than the spread, the underdog covered.
          lines[i].winner_ats =
            lines[i].dog === lines[i].winner ?  lines[i].dog :
              ((lines[i].losingScore - lines[i].spread) > lines[i].winningScore)
              ? lines[i].dog : lines[i].favorite,
          // the loser ATS is the team that didn't cover...
          lines[i].loser_ats =
            lines[i].winner_ats === lines[i].favorite ? lines[i].dog : lines[i].favorite,
            lines[i].favorite_diff_ats =
              (lines[i].favorite === lines[i].winner) ?
                lines[i].winningScore - lines[i].losingScore + lines[i].spread
                :
                lines[i].losingScore - lines[i].winningScore + lines[i].spread,
            lines[i].dog_diff_ats = (-1 * lines[i].favorite_diff_ats),
            lines[i].over = ((lines[i].winningScore + lines[i].losingScore) > lines[i].total) ?
              true
              :
              false,
            lines[i].over_differential = (lines[i].winningScore + lines[i].losingScore - lines[i].total)

          }
        }
        aggregate.push(lines[i]);
      }
    }
  }

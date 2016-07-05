// This file will iterate weekly performance for teams against the spread for each season from 2006...
  var games = require("./aggregate.js")
  , no_games = games.length
  , fs = require("fs")
  , teamsObj = require("../exports/teams_key.js");

  var teams_keys = Object.keys(teamsObj);
  teams = [];

  for(var i = 0; i < teams_keys.length; i ++){
    teams.push(teamsObj[teams_keys[i]])
  }

  // let's test populating one season, for one team
  var sort_games = function(year, team){
    var arr = [];
    //first, we're iterating through the entire game file
    for(var i = 0; i < no_games; i++){
        //since our games file isn't correctly sorted, we'll pull
        // the weeks in manually, to ensure chronology
        for(var k = 1; k < 17; k++)   {
          //nex, let's skip games who don't meet both the year and the week criteria
          if(
            (games[i].year === year)
            &&
            (games[i].week === k)
          )
            {
            //   if(arr[k-1] === undefined){
            //     arr[k-1] = arr[k-2];
            // }
            var spread = games[i].spread;
            //we'll persist the data differently, depending on
            //whether our team is a favorite or underdog
            if(games[i].fav === team){
              arr[k] = {
                favorite : true,
                team : team,
                opponent: games[i].dog,
                week : k,
                year : year,
                spread: spread,
                ml: parseInt(games[i].ml_fav.replace("$","")),
                home: games[i].home === team,
                winner: games[i].winner === team,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                ats: games[i].fav_diff_ats,
                total: games[i].total,
                over: games[i].over,
                over_differential: (games[i].winningScore + games[i].losingScore) - games[i].total,
                o_u_expected_score: (games[i].total/2) - (games[i].spread/2),
                over_expected_diff: ((games[i].winner === team) * games[i.winningScore]) + ((games[i].loser === team) * games[i].losingScore) - ((games[i].total/2) + (games[i].spread/2))
              };
            }
            if(games[i].dog === team){
              arr[k] = {
                favorite : false,
                team : team,
                week : k,
                opponent: games[i].fav,
                year : year,
                spread: spread * -1,
                ml: parseInt(games[i].ml_dog.replace("$","")),
                home: games[i].home === team,
                winner: games[i].winner === team,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                ats: games[i].dog_diff_ats,
                total: games[i].total,
                over: games[i].over,
                over_differential: (games[i].winningScore + games[i].losingScore) - games[i].total,
                o_u_expected_score: (games[i].total/2) - (games[i].spread/2),
                over_expected_diff: ((games[i].winner !== team) * games[i.winningScore]) + ((games[i].loser === team) * games[i].losingScore) - ((games[i].total/2) + (games[i].spread/2))
              };
            }
          }
        }
    }
    return arr;
  };

  var pop_cumulatives = function(array){
    for(var i = 1; i < array.length; i++){
      if(i === 1){
        array[i].wins_ats = (1 * (array[i].ats > 0)),
        array[i].losses_ats = (1 * (array[i].ats < 0)),
        array[i].ties_ats = (1 * (array[i].ats === 0)),
        array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
        array[i].wins = (1 * (array[i].winner)),
        array[i].losses = (1 * !(array[i].winner)),
        array[i].record = array[i].wins + "-" + array[i].losses,
        array[i].o_u_wins = (array[i].over * 1) || 0,
        array[i].o_u_losses = (!(array[i].over) * 1) || 0,
        array[i].o_u_diff = array[i].over_differential,
        array[i].over_expected_diff = array[i].over_expected_diff,
        array[i].over_expected_record = array[i].over_expected_diff > 0,
        array[i].spread_differential = array[i].ats

      }
      // find the bye week, and don't iterate it
      else if((array[i] == undefined) && (i > 1)){
        array[i] = {
          BYE: true
        }
        ind = i;
      }
      else {
        if(array[i-1].BYE){
          array[i].wins_ats = array[i-2].wins_ats + (1 * (array[i].ats > 0)),
          array[i].losses_ats = array[i-2].losses_ats + (1 * (array[i].ats < 0)),
          array[i].ties_ats = array[i-2].ties_ats + (1 * (array[i].ats === 0)),
          array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
          array[i].wins = array[i-2].wins + (1 * (array[i].winner)),
          array[i].losses = array[i-2].losses + (1 * !(array[i].winner)),
          array[i].record = array[i].wins + "-" + array[i].losses,
          array[i].o_u_wins = array[i-2].o_u_wins + (array[i].over * 1),
          array[i].o_u_losses = array[i-2].o_u_losses + (!(array[i].over) * 1),
          array[i].o_u_diff = array[i-2].o_u_diff + (array[i].over_differential),
          array[i].over_expected_diff = array[i-2].over_expected_diff + array[i].over_expected_diff,
          array[i].over_expected_record = array[i-2].over_expected_record + (array[i].over_expected_record * 1),
          array[i].spread_differential = array[i-2].spread_differential + array[i].ats
        }
        else {
          array[i].wins_ats = array[i-1].wins_ats + (1 * (array[i].ats > 0)),
          array[i].losses_ats = array[i-1].losses_ats + (1 * (array[i].ats < 0)),
          array[i].ties_ats = array[i-1].ties_ats + (1 * (array[i].ats === 0)),
          array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
          array[i].wins = array[i-1].wins + (1 * (array[i].winner)),
          array[i].losses = array[i-1].losses + (1 * !(array[i].winner)),
          array[i].record = array[i].wins + "-" + array[i].losses,
          array[i].o_u_wins = array[i-1].o_u_wins + (array[i].over * 1),
          array[i].o_u_losses = array[i-1].o_u_losses + (!(array[i].over) * 1),
          array[i].o_u_diff = array[i-1].o_u_diff + (array[i].over_differential),
          array[i].over_expected_diff = array[i-1].over_expected_diff + array[i].over_expected_diff,
          array[i].over_expected_record = array[i-1].over_expected_record + (array[i].over_expected_record * 1),
          array[i].spread_differential = array[i-1].spread_differential + array[i].ats
        }
      }
    }
    array.shift();
    return array;
  };

  var test = [];

  for(var t = 0; t < teams.length; t++){
    var temp_team = {
      [teams[t]] : {}
    };
    for(var i = 2006; i < 2016; i++){
      temp_team[teams[t]][i] = {}
      temp_team[teams[t]][i] = pop_cumulatives(sort_games(i, teams[t]));
    }
    test.push(temp_team);
  }


fs.writeFile("teamsX.json", JSON.stringify(test, 6, "\t"), function(){
  console.log("check test.js for the shit");
})

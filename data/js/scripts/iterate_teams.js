var arr = []
  , games = require("./aggregate.js")
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
                week : k,
                year : year,
                spread: spread,
                ml: games[i].ml_fav,
                home: games[i].home === team,
                winner: games[i].winner === team,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                ats: games[i].fav_diff_ats,
                total: games[i].total,
                over: games[i].over
              };
            }
            if(games[i].dog === team){
              arr[k] = {
                favorite : false,
                team : team,
                week : k,
                year : year,
                spread: spread * -1,
                ml: games[i].ml_dog,
                home: games[i].home === team,
                winner: games[i].winner === team,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                ats: games[i].dog_diff_ats,
                total: games[i].total,
                over: games[i].over
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
        array[i].record = array[i].wins + "-" + array[i].losses;
      }
      // find the bye week, and don't iterate it
      else if((array[i] == undefined) && (i > 1)){
        array[i] = {
          BYE: true
        }
      }
      else {
        if(array[i-1].BYE){
          array[i].wins_ats = array[i-2].wins_ats + (1 * (array[i].ats > 0)),
          array[i].losses_ats = array[i-2].losses_ats + (1 * (array[i].ats < 0)),
          array[i].ties_ats = array[i-2].ties_ats + (1 * (array[i].ats === 0)),
          array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
          array[i].wins = array[i-2].wins + (1 * (array[i].winner)),
          array[i].losses = array[i-2].losses + (1 * !(array[i].winner)),
          array[i].record = array[i].wins + "-" + array[i].losses;
        }
        else {
          array[i].wins_ats = array[i-1].wins_ats + (1 * (array[i].ats > 0)),
          array[i].losses_ats = array[i-1].losses_ats + (1 * (array[i].ats < 0)),
          array[i].ties_ats = array[i-1].ties_ats + (1 * (array[i].ats === 0)),
          array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
          array[i].wins = array[i-1].wins + (1 * (array[i].winner)),
          array[i].losses = array[i-1].losses + (1 * !(array[i].winner)),
          array[i].record = array[i].wins + "-" + array[i].losses;
        }
      }
      // console.log(array[i-1])
    }
    return array;

  };

// var test = [];
//
// for(var year = 2006; year <= 2015; year++){
//   test[2006 - year] = pop_cumulatives(sort_games(year, "New Orleans"));
// }
//
// console.log(test);
//
//

console.log(pop_cumulatives(sort_games(2015, "New Orleans")));



// fs.writeFile("teams.js", JSON.stringify(teams_arr, 6, "\t"), function(){
//   console.log("check teams.js for the shit");
// })

// fs.writeFile("teams.js", JSON.stringify(teams, 6, "\t"), function(){
//   console.log("check teams.js for output")
// })

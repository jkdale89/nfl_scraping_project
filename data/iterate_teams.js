var fs = require('fs')
    , games = require("./js/games.js")
    , no_games = games.length
    , arr = []
    , master = {};


    //let's test populating one season, for one team

    //first, we're iterating through the entire game file
    for(var i = 0; i < no_games; i++){
      //we'll start with just the 2006 season
      for(var j = 2006; j < 2007; j++){
        //since our games file isn't correctly sorted, we'll pull
        // the weeks in manually, to ensure chronology
        for(var k = 1; k < 18; k++)   {
          //nex, let's skip games who don't meet both the year and the week criteria
          if(
            (games[i].year === j)
            &&
            (games[i].week === k)
          ){
            if(arr[k-1] === undefined){
              arr[k-1] = arr[k-2];
              // arr[k-1].spread = "Bye";
              // arr[k-1].week = k;
              // arr[k-1].favorite = "Bye";
            }
            var spread = games[i].spread;
            //we'll persist the data differently, depending on
            //whether our team is a favorite or underdog
            if(games[i].favorite === "Cleveland"){
              arr[k] = {
                favorite : true,
                team : "Cleveland",
                week : k,
                year : j,
                spread: spread,
                ml: games[i].ml_fav,
                home: games[i].home === "Cleveland",
                winner: games[i].winner === "Cleveland",
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                ats: games[i].favorite_diff_ats,
                total: games[i].total,
                over: games[i].over
              };
            }
            if(games[i].dog === "Cleveland"){
              arr[k] = {
                favorite : false,
                team : "Cleveland",
                week : k,
                year : j,
                spread: spread * -1,
                ml: games[i].ml_dog,
                home: games[i].home === "Cleveland",
                winner: games[i].winner === "Cleveland",
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
    }

arr.shift();

for(var i = 0; i < arr.length; i++){
  // find the bye week, and don't iterate it
  if(arr[i-1] && (arr[i].week == arr[i-1].week)){
    arr[i].wins_ats = arr[i-2] ? arr[i-2].wins_ats + (1 * (arr[i].ats > 0)) : (1 * (arr[i].ats > 0)),
    arr[i].losses_ats = arr[i-2] ? arr[i-2].losses_ats + (1 * (arr[i].ats < 0)) : (1 * (arr[i].ats < 0)),
    arr[i].ties_ats = arr[i-2] ? arr[i-2].ties_ats + (1 * (arr[i].ats === 0)) : (1 * (arr[i].ats === 0)),
    arr[i].record_ats = arr[i].wins_ats + "-" + arr[i].losses_ats + "-" + arr[i].ties_ats,
    arr[i].wins = arr[i-2] ? arr[i-2].wins + (1 * (arr[i].winner)) : (1 * (arr[i].winner)),
    arr[i].losses = arr[i-2] ? arr[i-2].losses + (1 * !(arr[i].winner)) : (1 * !(arr[i].winner)),
    arr[i].record = arr[i].wins + "-" + arr[i].losses;
  }
  else {
    arr[i].wins_ats = arr[i-1] ? arr[i-1].wins_ats + (1 * (arr[i].ats > 0)) : (1 * (arr[i].ats > 0)),
    arr[i].losses_ats = arr[i-1] ? arr[i-1].losses_ats + (1 * (arr[i].ats < 0)) : (1 * (arr[i].ats < 0)),
    arr[i].ties_ats = arr[i-1] ? arr[i-1].ties_ats + (1 * (arr[i].ats === 0)) : (1 * (arr[i].ats === 0)),
    arr[i].record_ats = arr[i].wins_ats + "-" + arr[i].losses_ats + "-" + arr[i].ties_ats,
    arr[i].wins = arr[i-1] ? arr[i-1].wins + (1 * (arr[i].winner)) : (1 * (arr[i].winner)),
    arr[i].losses = arr[i-1] ? arr[i-1].losses + (1 * !(arr[i].winner)) : (1 * !(arr[i].winner)),
    arr[i].record = arr[i].wins + "-" + arr[i].losses;
  }
}


master["Cleveland"] = {};

master["Cleveland"]["2006"] = arr;

fs.writeFile("test.json", JSON.stringify(master, null, 6), function(err){
  console.log("check test.json i guess?")
});

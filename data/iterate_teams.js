var fs = require('fs')
    , games = require("./js/games.js")
    , no_games = games.length
    , arr = [];


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
            }
            var spread = games[i].spread;
            //we'll persist the data differently, depending on
            //whether our team is a favorite or underdog
            if(games[i].favorite === "Cleveland"){
              var wins_ats = arr[k-1] ? arr[k-1].wins_ats + (1 * (games[i].favorite_diff_ats > 0)) : 1 * (games[i].favorite_diff_ats > 0)
              , losses_ats = arr[k-1] ? arr[k-1].losses_ats + (1 * (games[i].dog_diff_ats > 0)) : 1 * (games[i].favorite_diff_ats < 0)
              , ties_ats = arr[k-1] ? arr[k-1].ties_ats + (1 * (games[i].favorite_diff_ats === 0)) : 1 * (games[i].favorite_diff_ats === 0);
              arr[k] = {
                favorite : true,
                team : "Cleveland",
                week : k,
                year : j,
                spread: spread,
                result_ats: games[i].favorite_diff_ats,
                wins_ats: wins_ats,
                losses_ats: losses_ats,
                ties_ats: ties_ats
              };
            }
            if(games[i].dog === "Cleveland"){
              var wins_ats = arr[k-1] ? arr[k-1].wins_ats + (1 * (games[i].dog_diff_ats > 0)) : 1 * (games[i].dog_diff_ats > 0)
              , losses_ats = arr[k-1] ? arr[k-1].losses_ats + (1 * (games[i].dog_diff_ats < 0)) : 1 * (games[i].dog_diff_ats < 0)
              , ties_ats = arr[k-1] ? arr[k-1].ties_ats + (1 * (games[i].favorite_diff_ats === 0)) : 1 * (games[i].dog_diff_ats === 0);
              arr[k] = {
                favorite : false,
                team : "Cleveland",
                week : k,
                year : j,
                spread: spread * -1,
                result_ats: games[i].dog_diff_ats,
                wins_ats: wins_ats,
                losses_ats: losses_ats,
                ties_ats: ties_ats
              };
            }
          }
        }
      }
    }

console.log(arr)

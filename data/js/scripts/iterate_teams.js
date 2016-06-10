var arr = []
  , games = require("./aggregate.js")
  , no_games = games.length;
  //let's test populating one season, for one team
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
          ){
            if(arr[k-1] === undefined){
              arr[k-1] = arr[k-2];
            }
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
    console.log(arr);
    // arr.shift();
    console.log(arr);
    return arr;
  };

  var pop_cumulatives = function(array){
    for(var i = 1; i < array.length; i++){
      // find the bye week, and don't iterate it
      if(array[i-1] && (array[i] ? array[i].week === array[i-1].week : false)){
        array[i].wins_ats = array[i-2] ? array[i-2].wins_ats + (1 * (array[i].ats > 0)) : (1 * (array[i].ats > 0)),
        array[i].losses_ats = array[i-2] ? array[i-2].losses_ats + (1 * (array[i].ats < 0)) : (1 * (array[i].ats < 0)),
        array[i].ties_ats = array[i-2] ? array[i-2].ties_ats + (1 * (array[i].ats === 0)) : (1 * (array[i].ats === 0)),
        array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
        array[i].wins = array[i-2] ? array[i-2].wins + (1 * (array[i].winner)) : (1 * (array[i].winner)),
        array[i].losses = array[i-2] ? array[i-2].losses + (1 * !(array[i].winner)) : (1 * !(array[i].winner)),
        array[i].record = array[i].wins + "-" + array[i].losses;
      }
      else {
        array[i].wins_ats = array[i-1] ? array[i-1].wins_ats + (1 * (array[i].ats > 0)) : (1 * (array[i].ats > 0)),
        array[i].losses_ats = array[i-1] ? array[i-1].losses_ats + (1 * (array[i].ats < 0)) : (1 * (array[i].ats < 0)),
        array[i].ties_ats = array[i-1] ? array[i-1].ties_ats + (1 * (array[i].ats === 0)) : (1 * (array[i].ats === 0)),
        array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
        array[i].wins = array[i-1] ? array[i-1].wins + (1 * (array[i].winner)) : (1 * (array[i].winner)),
        array[i].losses = array[i-1] ? array[i-1].losses + (1 * !(array[i].winner)) : (1 * !(array[i].winner)),
        array[i].record = array[i].wins + "-" + array[i].losses;
      }
    }
    arr = array;
    console.log(arr);
  };

pop_cumulatives(sort_games(2006, "Chicago"));

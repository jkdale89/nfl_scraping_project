// what we're looking for
//
// cumulative favorites performance over the season
// cumulative underdog performance over the season
// cumulative home performance over the season
// cumulative away performance over the season
//
// ^^ both ats and straight up



// this file will iterate results for favs, dogs, home, away, ats, o/u
  var games = require("./aggregate.js")
  , no_games = games.length
  , fs = require("fs");

  var sort_games = function(year, type){
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
          if(type === "fav"){
            var spread = games[i].spread;
              temp = {
                fav_bin : true,
                fav: games[i].fav,
                dog: games[i].dog,
                home: games[i].home === games[i].fav,
                week : k,
                year : games[i].year,
                spread: spread,
                ml: games[i].ml_fav,
                winner: games[i].winner === games[i].fav,
                ats: games[i].fav_diff_ats,
                winner_ats: (games[i].fav_diff_ats > 0),
                winningTeam: games[i].winner,
                losingTeam: games[i].loser,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                gameId: games[i].id_match
              };
            }
          else if(type === "dog"){
            var spread = -1 * games[i].spread;
              temp = {
                fav_bin : false,
                fav: games[i].fav,
                dog: games[i].dog,
                home: games[i].home === games[i].dog,
                week : k,
                year : games[i].year,
                spread: spread,
                ml: games[i].ml_dog,
                winner: games[i].winner === games[i].dog,
                ats: games[i].dog_diff_ats,
                winner_ats: (games[i].dog_diff_ats > 0),
                winningTeam: games[i].winner,
                losingTeam: games[i].loser,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                gameId: games[i].id_match
              };
            }
          else if(type === "home"){
              temp = {
                favorite : games[i].home === games[i].fav,
                home: true,
                homeTeam: games[i].home,
                awayTeam: games[i].away,
                week: k,
                year : games[i].year,
                spread: ((games[i].fav !== games[i].home) * -1) * games[i].spread,
                winner: games[i].winner === games[i].home,
                winner_ats: games[i].winner_ats === games[i].home,
                ats: ((games[i].fav === games[i].home) * 1) * games[i].fav_diff_ats + ((games[i].fav !== games[i].home) * -1) * games[i].fav_diff_ats,
                winningTeam: games[i].winner,
                losingTeam: games[i].loser,
                winningScore: games[i].winningScore,
                losingScore: games[i].losingScore,
                gameId: games[i].id_match
              }
            }
          else if(type === "away"){
            temp = {
              favorite: games[i].away === games[i].fav,
              home: false,
              homeTeam: games[i].home,
              awayTeam: games[i].away,
              week: k,
              year : games[i].year,
              spread: ((games[i].fav !== games[i].away) * -1) * games[i].spread,
              winner: games[i].winner === games[i].away,
              winner_ats: games[i].winner_ats === games[i].away,
              ats: ((games[i].fav === games[i].away) * 1) * games[i].fav_diff_ats + ((games[i].fav !== games[i].away) * -1) * games[i].fav_diff_ats,
              winningTeam: games[i].winner,
              losingTeam: games[i].loser,
              winningScore: games[i].winningScore,
              losingScore: games[i].losingScore,
              gameId: games[i].id_match
            }
          }
          arr.push(temp);
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
        array[i].multiplier = 1;
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
          array[i].multiplier = i % 16;
        }
        else {
          array[i].wins_ats = array[i-1].wins_ats + (1 * (array[i].ats > 0)),
          array[i].losses_ats = array[i-1].losses_ats + (1 * (array[i].ats < 0)),
          array[i].ties_ats = array[i-1].ties_ats + (1 * (array[i].ats === 0)),
          array[i].record_ats = array[i].wins_ats + "-" + array[i].losses_ats + "-" + array[i].ties_ats,
          array[i].wins = array[i-1].wins + (1 * (array[i].winner)),
          array[i].losses = array[i-1].losses + (1 * !(array[i].winner)),
          array[i].record = array[i].wins + "-" + array[i].losses,
          array[i].multiplier = i % 16;
        }
      }
    }
    array.shift();
    return array;
  };

var arr_home = [];
for(var i = 2006; i <= 2015; i++){
  var temp_year = {
    [i] : {}
  };
  temp_year[i] = pop_cumulatives(sort_games(i, "home"));
  arr_home.push(temp_year);
}

var arr_away = [];
for(var i = 2006; i <= 2015; i++){
  var temp_year = {
    [i] : {}
  };
  temp_year[i] = pop_cumulatives(sort_games(i, "away"));
  arr_away.push(temp_year);
}

var arr_fav = [];
for(var i = 2006; i <= 2015; i++){
  var temp_year = {
    [i] : {}
  };
  temp_year[i] = pop_cumulatives(sort_games(i, "fav"));
  arr_fav.push(temp_year);
}

var arr_dog = [];
for(var i = 2006; i <= 2015; i++){
  var temp_year = {
    [i] : {}
  };
  temp_year[i] = pop_cumulatives(sort_games(i, "dog"));
  arr_dog.push(temp_year);
}

fs.writeFile("../../../working_data/home.json", JSON.stringify(arr_home, 6, "\t"), function(){
  console.log("check working_front_end/away.js for results");
})

fs.writeFile("../../../working_data/away.json", JSON.stringify(arr_away, 6, "\t"), function(){
  console.log("check working_front_end/away.js for results");
})

fs.writeFile("../../../working_data/fav.json", JSON.stringify(arr_fav, 6, "\t"), function(){
  console.log("check working_front_end/away.js for results");
})

fs.writeFile("../../../working_data/dog.json", JSON.stringify(arr_dog, 6, "\t"), function(){
  console.log("check working_front_end/away.js for results");
})




// fs.writeFile("test.js", JSON.stringify(test, 6, "\t"), function(){
//   console.log("check test.js for the shit");
// })

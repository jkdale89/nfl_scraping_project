var fs = require('fs')
    , games = require("./js/games.js")
    , teams_key = require("./teams_key")
    , len = games.length
    , teamsArr = []

  // we're trying to loop through each game, and extract team's year to date information
  // both straight up, and against the spread
  for(var i = 0; i < len; i ++) {
    //if the team Array doesn't exist, add it
    if(!(teamsArr[games[i].winner])){
      teamsArr[games[i].winner] = {};
        teamsArr[games[i].winner].wins = 1,
        teamsArr[games[i].winner].losses = 0,
        teamsArr[games[i].winner].over = 0,
        teamsArr[games[i].winner].under = 0,
        teamsArr[games[i].winner].wins_ats = 0,
        teamsArr[games[i].winner].losses_ats = 0,
        teamsArr[games[i].winner].point_diff = 0,
        teamsArr[games[i].winner].point_diff_ats = 0,
        teamsArr[games[i].winner].record = 0,
        teamsArr[games[i].winner].record_ats = 0
      }
    if(!(teamsArr[games[i].loser])){
      teamsArr[games[i].loser] = {};
        teamsArr[games[i].loser].wins = 0,
        teamsArr[games[i].loser].losses = 1,
        teamsArr[games[i].loser].over = 0,
        teamsArr[games[i].loser].under = 0,
        teamsArr[games[i].loser].wins_ats = 0,
        teamsArr[games[i].loser].losses_ats = 0,
        teamsArr[games[i].loser].point_diff = 0,
        teamsArr[games[i].loser].point_diff_ats = 0,
        teamsArr[games[i].loser].record = 0,
        teamsArr[games[i].loser].record_ats = 0
    }
    if(teamsArr[games[i].winner]){

    }
  }

  console.log(teamsArr);

  // fs.writeFile("aggregate.json", JSON.stringify(aggregate, null, 6), function(err) {
  //     console.log("check aggreagate.json for the output.")
  // });

var fs = require('fs'),
    results = require("./results.js"),
    len = Object.keys(results[0]).length,
    newColl = [];



  for(var i = 0; i < results.length; i++){
    if(results[i]["Result"] === "Postponed"){
      i ++
    }
    else {
      var newObj = {}
        , away = results[i]["Away Team"]
        , awayArray = away.split(" ")
        , home = results[i]["Home Team"]
        , homeArray = home.split(" ")
        , score = results[i]["Result"]|| "This is the problematic one"
        , scoreArray = score.split(",")

        // establish variables for winning team, winning score
        , winnerArr = scoreArray[0].split(" ")
        , winner = winnerArr[0]
        , winningScore = winnerArr[1]
        // establish variables for losing team, losing score
        , loserArr = scoreArray[1].split(" ")
        , loser = loserArr[1]
        , losingScore = loserArr[2];

        newObj.awayNickname = awayArray.pop();
        newObj.awayTeam = awayArray.join(" ");
        newObj.homeNickname = homeArray.pop();
        newObj.homeTeam = homeArray.join(" ");
        newObj.winner = winner;
        newObj.winningScore = parseInt(winningScore);
        newObj.loser = loser;
        newObj.losingScore = parseInt(losingScore);
        newObj.week = results[i]["Week"];
        newObj.year = results[i]["Year"];
        //This creates a semantic id in form of "homeNick/awayNick/week/year". Can be used for tying together lines
        newObj.idj = newObj.homeNickname + newObj.awayNickname + newObj.week.toString() + newObj.year.toString();
        newColl.push(newObj);
      }
  }

fs.writeFile("clean_lines.json", JSON.stringify(newColl, null, 6), function(err) {
  console.log("check this dir for the output.")
});

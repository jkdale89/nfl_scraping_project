var lines = require("./lines.js"),
    results = require("./results.js"),
    len = Object.keys(lines[0]).length,
    newColl = [];



  for(var i = 0; i < 1; i++){
    var newObj = {}
        , away = results[i]["Away Team"]
        , awayArray = away.split(" ")
        , home = results[i]["Home Team"]
        , homeArray = home.split(" ")
        , score = results[i]["Results"]
        , score.split(",")
        ,

        newObj.awayNickname = awayArray.pop();
        newObj.awayTeam = awayArray.join(" ");
        newObj.homeNickname = homeArray.pop();
        newObj.homeTeam = homeArray.join(" ");

        console.log(newObj);
  }

var lines = require("../exports/clean_lines.js");

console.log(lines);


  var clean_lines = function(lines){
    for(var i = 0; i < lines.length; i++){
      var cur = lines[i]
      if(cur["Favorite"] === "") {
        i ++
      }
      else {
      // create a new object for reformatting lines
      var newObjL = {}
        , fav = cur["Favorite"]
        , spread = parseFloat(cur["Spread"])
        , dog = cur["Dawg"]
        , total = parseInt(cur["Total"])
        , ml_arr = cur["Odds"].split(" ")
        , ml_fav = ml_arr[0]
        , ml_dog = ml_arr[1]
        , home = ""
        , away = "";

        // console.log(fav.indexOf("At") + "is the index of At");
        // console.log(dog.indexOf("At") + "is the index of At");
        if((fav.indexOf("At ") + 1) === 1){
          fav = fav.slice(3, fav.length);
          home = fav;
          away = dog;
        }

        if((dog.indexOf("At ") + 1) === 1) {
          dog = dog.slice(3, dog.length);
          home = dog;
          away = fav;
        }

        newObjL.favorite = fav;
        newObjL.spread = spread;
        newObjL.dog = dog;
        newObjL.total = total;
        newObjL.ml_fav = ml_fav;
        newObjL.ml_dog = ml_dog;
        newObjL.week = cur["Week"];
        newObjL.year = cur["Year"];
        newObjL.home = home;
        newObjL.idj = home + away + newObjL.week.toString() + newObjL.year.toString();
        newLines.push(newObjL);
      }
    }
  };

// fs.writeFile("./json/clean_lines.json", JSON.stringify(newLines, null, 6), function(err){
//   console.log("check clean_lines.json for output");
// })

  var clean_results = function(results){
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
          , losingScore = loserArr[2]

          //Reconcile the NYG and NYJ with the lines files
          // if the nickname is "NYG", change team name to "NY Giants"
          // if the nickname is "NYG", change the team name to "NY Jets"
          , awayNickname = awayArray.pop()
          , homeNickname = homeArray.pop();

          newObj.awayTeam = awayArray.join(" ");
          newObj.homeTeam = homeArray.join(" ");

          if(awayNickname === "NYG") {
            newObj.awayTeam = "NY Giants"
          }
          if(awayNickname === "NYJ"){
            newObj.awayTeam = "NY Jets"
          }
          if(homeNickname === "NYG"){
            newObj.homeTeam = "NY Giants"
          }
          if(homeNickname === "NYJ"){
            newObj.homeTeam === "NY Jets"
          }

          newObj.awayNickname = awayNickname;
          newObj.homeNickname = homeNickname;
          newObj.winner = winner;
          newObj.winningScore = parseInt(winningScore);
          newObj.loser = loser;
          newObj.losingScore = parseInt(losingScore);
          newObj.week = results[i]["Week"];
          newObj.year = results[i]["Year"];
          //This creates a semantic id in form of "homeNick/awayNick/week/year". Can be used for tying together lines
          newObj.idj = newObj.homeTeam + newObj.awayTeam + newObj.week.toString() + newObj.year.toString();
          newResults.push(newObj);
        }
      }
    };

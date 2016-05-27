var fs = require('fs')
    , results = require("./js/clean_results.js");

var arr = {};
  for(var i = 0; i < results.length; i++){
    if(!(arr[results[i].awayNickname])){
      arr[results[i].awayNickname] = results[i].awayTeam;
    }
  }

  console.log(arr)

  

  fs.writeFile("teams_key_output.json", JSON.stringify(arr, null, 6), function(err) {
      console.log("check teams_key.json for the output.")
  });

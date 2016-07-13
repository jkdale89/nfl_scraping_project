var away = require("../exports/working_data/away.js"),
    home = require("../exports/working_data/home.js"),
    fav = require("../exports/working_data/fav.js"),
    dog = require("../exports/working_data/dog.js"),
    fs = require("fs");

var joe = function(array, str){

var arr = [];

  for(var y = 2006; y <= 2015; y++){
    // the object format we have means the index needs to first correspond to year
    // deal with it
    var ind = y - 2006;
    var obj = {
      [y]: []
    }
    // loop through the weeks so the games are sorted correctly
    for(var i = 1; i <= 16; i ++){
      // loop through each game, because we're idiots and some of the weeks
      // were tacked onto the end
      for(var j = 0; j < array[ind][y].length; j++){
        if(array[ind][y][j].week == i){
          obj[y].push(array[ind][y][j])
        }
      }
    }
    arr.push(obj)
  }
    fs.writeFile("./sorted/" + str + ".js", "module.exports = " + JSON.stringify(arr, 6, "\t"), function(){
      console.log("check ./sorted/" + str + ".json for output")
    });
}

joe(home, "home");
joe(away, "away");
joe(fav, "fav");
joe(dog, "dog");

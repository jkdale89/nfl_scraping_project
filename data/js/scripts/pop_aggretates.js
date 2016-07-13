var away = require("./sorted/away.js"),
    home = require("./sorted/home.js"),
    fav = require("./sorted/fav.js"),
    dog = require("./sorted/dog.js"),
    fs = require("fs");

var joe =  function(array, str){
  // master array
  var bigArr = [];
  for(var y = 2006; y <= 2015; y++){
    // array for all the games in year year
    var obj = {
      [y]: []
    }
    // match the index to the year
    var ar = array[y-2006][y];

    for(var i = 0; i < ar.length; i++){

      if(i == 0){
        ar[i].wins_ats = 0 + (ar[i].ats > 0);
        ar[i].losses_ats = 0 + (ar[i].ats < 0);
        ar[i].ties_ats = 0 + (ar[i].ats == 0);
        ar[i].record_ats = ar[i].wins_ats + "-" + ar[i].losses_ats + "-" + ar[i].ties_ats;
      }
      else {
        ar[i].wins_ats = ar[i-1].wins_ats + (ar[i].ats > 0);
        ar[i].losses_ats = ar[i-1].losses_ats + (ar[i].ats < 0);
        ar[i].ties_ats = ar[i-1].ties_ats + (ar[i].ats == 0);
        ar[i].record_ats = ar[i].wins_ats + "-" + ar[i].losses_ats + "-" + ar[i].ties_ats;
      }
      obj[y].push(ar[i]);
    }
    bigArr.push(obj)
  }
    fs.writeFile("./master/" + str + ".js", "module.exports = " + JSON.stringify(bigArr, 6, "\t"));
}

joe(away, "away");
joe(home, "home");
joe(fav, "fav");
joe(dog, "dog");

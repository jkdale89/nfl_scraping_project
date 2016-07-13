var away = require("./master/away.js"),
    home = require("./master/home.js"),
    fav = require("./master/fav.js"),
    dog = require("./master/dog.js"),
    fs = require("fs");

var joe = function(array){
  var bigArr = [];
  for(var i = 2006; i <= 2015; i++){
    var ind = i - 2006;
    var obj = {
      [i] : []
    }
    var cur = array[ind][i];
    for(var j = 0; j < cur.length - 1; j++){
      if(cur[j].week !== cur[j+1].week){
        obj[i].push(cur[j]);
      }

    }
    bigArr.push(obj);
  }
  fs.writeFile("test.js", JSON.stringify(bigArr, 6, "\t"));
}

joe(away);

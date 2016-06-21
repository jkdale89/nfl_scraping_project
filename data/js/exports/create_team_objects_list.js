var teamsList = require("./teams_key.js")
    , fs = require("fs")
    , teams_length = Object.keys(teamsList).length;

    var teams_keys = Object.keys(teamsList);
    teams_city = [];

    for(var i = 0; i < teams_keys.length; i ++){
      teams_city.push(teamsList[teams_keys[i]])
    }

    console.log(Object.keys(teamsList));

var mast_obj = {};
    for(var i = 0; i < teams_length; i++){
      var obj = {};
      obj = {};
      obj.abbr = teams_keys[i];
      obj.nick = "";
      obj.city = teams_city[i];
      obj.url = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/" + obj.nick + ".png&h=150&w=150";
      mast_obj[teams_city[i]] = obj;
    }

fs.writeFile("test.js", JSON.stringify(mast_obj, 6, "\t"), function(){
  "check test.js for output"
});

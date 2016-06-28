var fs = require("fs")
    , teamsMeta = require("./teams_meta.js")
    , teams = Object.keys(teamsMeta)
    , convertHex = function(hex,opacity){
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
      };

for(var i = 0; i < teams.length; i++){
  teamsMeta[teams[i]].rgba  = '';
  teamsMeta[teams[i]].rgba = convertHex(teamsMeta[teams[i]].hex, 30);
  teamsMeta[teams[i]].sec_rgba = '';
  teamsMeta[teams[i]].sec_rgba = convertHex(teamsMeta[teams[i]].sec_hex, 30);
}

fs.writeFile("./teams_meta.json", JSON.stringify(teamsMeta, 6, "\t"));

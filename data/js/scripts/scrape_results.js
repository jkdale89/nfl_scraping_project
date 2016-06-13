
var results = function(week, year){
    var request = require('request'), cheerio = require('cheerio');
    var weekTest = function(input){
      if(input === 1){
        return '';
      }
      else {
        var res = "/" + input.toString();
        return res;
      }
    };
      var results = [];
      url = "http://espn.go.com/nfl/schedule/_/year/" + year.toString() + weekTest(week);
      console.log(url);
      request(url, function(error, response, html){
        if(!error){

          var $ = cheerio.load(html);
          var data = $("tbody").children();
          for(var i = 0; i <= data.length; i ++){
            result = {
                "Away Team": data.eq(i).children().eq(0).text(),
                "Home Team": data.eq(i).children().eq(1).text(),
                "Result": data.eq(i).children().eq(2).text(),
                "Week": week,
                "Year": year
            }
            if(result["Away Team"] === ""){
              i ++;
            }
            else {
              results.push(result)
            }
          }
          console.log(results);
        }
      })
  }

results(13, 2015);
  var results_mnf = function(){

  }

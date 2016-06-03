module.exports = {
  lines: function(week){
    var request = require('request'), cheerio = require('cheerio');
    url = "http://www.footballlocks.com/nfl_odds_week_" + week.toString() + ".shtml";
    request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);
          for(var i = 2007; i <= 2007; i++){
            var year_str = i.toString();
            //lets grab the first block of games
            var data = $("b:contains('Closing Las Vegas NFL Odds From Week " + week.toString() + ", " + year_str + "')").parent().parent().parent().parent().find("tr:has(td)");
            //lets grab the monday night football games
            var mnf_data = $("b:contains('Monday Night Football Odds'):contains('" + year_str + "')").parent().parent().parent().next().eq(0).find("tr:has(td)");
            var result = [];
            for(var j = 1; j <= 17; j ++){
              var temp = {
                "Time" : data.eq(j).children().eq(0).text(),
                "Favorite" : data.eq(j).children().eq(1).text(),
                "Spread" : data.eq(j).children().eq(2).text(),
                "Dawg" : data.eq(j).children().eq(3).text(),
                "Total" : data.eq(j).children().eq(4).text(),
                "Odds" : data.eq(j).children().eq(5).text(),
                "Week" : week,
                "Year" : i
              }
              temp.id = temp.Time + temp.Favorite + temp.Spread;
              //make sure empty objects don't get pushed
              if(temp.Time){
                result.push(temp);
              }
            }

          var removeDups = function(array){
            for(var i = 0; i < array.length; i ++){
              var temp = array[i].id;
              for(var j = (i + 1); j < array.length; j ++){
                if(array[j].id == temp){
                  array.splice(j)
                }
              }
            }
          }
          removeDups(result);
          console.log(result);
        }
      }
    })
  },

  results: function(week, year){
    var request = require('request'), cheerio = require('cheerio');
    var weekTest = function(input){
      if(input === 1){
        return null
      }
      else {
        var result = "/" + input.toString();
        return result;
      }
    };
    url = "http://espn.go.com/nfl/schedule/_/year/" + year.toString() + weekTest(week);
    request(url, function(error, response, html){
      if(!error){
        var result = [];
        var $ = cheerio.load(html);
        var data = $("tbody").children();
        for(var i = 0; i <= data.length; i ++){
          result[i] = {
              "Away Team": data.eq(i).children().eq(0).text(),
              "Home Team": data.eq(i).children().eq(1).text(),
              "Result": data.eq(i).children().eq(3).text()
          }
          console.log(result)
        }
      }
    })
  }
}

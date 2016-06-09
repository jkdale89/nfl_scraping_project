module.exports = {
  lines: function(week, write){
    var request = require('request'), cheerio = require('cheerio'), fs = require('fs'), results = [];
    url = "http://www.footballlocks.com/nfl_odds_week_" + week.toString() + ".shtml";
    request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);
          for(var i = 2006; i <= 2015; i++){
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

              //sometimes the lines will have '(At London)' or '(Toronto)' - let's correct this
              if(temp.Favorite.indexOf('(') > 0){
                temp.Favorite = temp.Favorite.substring(0, temp.Favorite.indexOf('('));
              }

              //same thing, for underdog
              if(temp.Dawg.indexOf('(') > 0){
                temp.Dawg = temp.Dawg.substring(0, temp.Dawg.indexOf('('));
              }



              //identify a unique id for removing duplicates, in a sec;
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
          results.push(result);
        }
        console.log(results)
      }
      var week_display = (week / 10) < 1 ? "0" : "";
      fs.writeFile("./exports/lines/lines_week_" + week_display + week + ".js", JSON.stringify(results, 6, "\t") + (week === 16 ? "" : ","), function(){
        console.log("check ./exports/lines.json for the output");
      })
    })
  }
  // DEPRECATED
  // results: function(week, year){
  //   var request = require('request'), cheerio = require('cheerio');
  //   var weekTest = function(input){
  //     if(input === 1){
  //       return '';
  //     }
  //     else {
  //       var res = "/" + input.toString();
  //       return res;
  //     }
  //   };
  //     var results = [];
  //     url = "http://espn.go.com/nfl/schedule/_/year/" + year.toString() + weekTest(week);
  //     console.log(url);
  //     request(url, function(error, response, html){
  //       if(!error){
  //
  //         var $ = cheerio.load(html);
  //         var data = $("tbody").children();
  //         for(var i = 0; i <= data.length; i ++){
  //           result = {
  //               "Away Team": data.eq(i).children().eq(0).text(),
  //               "Home Team": data.eq(i).children().eq(1).text(),
  //               "Result": data.eq(i).children().eq(2).text(),
  //               "Week": week,
  //               "Year": year
  //           }
  //           if(result["Away Team"] === ""){
  //             i ++;
  //           }
  //           else {
  //             results.push(result)
  //           }
  //         }
  //         console.log(results);
  //       }
  //     })
  // }
}

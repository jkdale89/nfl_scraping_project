var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var populate = function(week){
  url = "http://www.footballlocks.com/nfl_odds_week_" + week.toString() + ".shtml";
  request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);
        for(var i = 2006; i <= 2015; i++){
          var year_str = i.toString();
          var data = $("b:contains('Closing Las Vegas NFL Odds From Week " + week.toString() + ", " + year_str + "')").parent().parent().parent().parent().find("tr:has(td)");
          var result = [];
          result.length = data.length;
          for(var j = 0; j < 18; j ++){
            result[j] = {
              "Time" : data.eq(j).children().eq(0).text(),
              "Favorite" : data.eq(j).children().eq(1).text(),
              "Spread" : data.eq(j).children().eq(2).text(),
              "Dawg" : data.eq(j).children().eq(3).text(),
              "Total" : data.eq(j).children().eq(4).text(),
              "Odds" : data.eq(j).children().eq(5).text(),
              "Week" : week,
              "Year" : i
            }
          }
        result.shift();
        console.log(result);
        fs.writeFile(week.toString() + "_" + year_str + ".json", JSON.stringify(result, null, 6), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        })
      }
    }
  })
}

app.get('/scrape', function(req, res){
  for(var i = 1; i <= 17; i++){
    populate(i)
  }
})





app.listen('1989')
console.log('Magic happens on port 1989');
exports = module.exports = app;

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var weekTest = function(input){
  if(input === 1){
    return null
  }
  else {
    var result = "/" + input.toString();
    return result;
  }
}

var populate = function(week, year){
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

app.get('/scrape_results', function(req, res){
  populate(1, 2006)
})

app.listen('1989')
console.log('Magic happens on port 1989');
exports = module.exports = app;

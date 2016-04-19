var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

url = "http://www.footballlocks.com/nfl_odds_week_1.shtml";

request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

    var data = $("b:contains('Closing Las Vegas NFL Odds From Week 1, 2013')").parent().parent().parent().parent().find("tr:has(td)");
    var result = [];
    result.length = data.length;

    for(var i = 0; i < result.length; i ++){
      result[i] =
      {
        "Time" : data.eq(i).children().eq(0).text(),
        "Favorite" : data.eq(i).children().eq(1).text(),
        "Spread" : data.eq(i).children().eq(2).text(),
        "Dawg" : data.eq(i).children().eq(3).text(),
        "Total" : data.eq(i).children().eq(4).text(),
        "Odds" : data.eq(i).children().eq(5).text()
      }
    }
    result.shift();
    console.log(result);
}

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function

// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
fs.writeFile('w1_2013.json', JSON.stringify(result, null, 6), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send(data.text())

    });
})

app.listen('1989')
console.log('Magic happens on port 1989');
exports = module.exports = app;

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

    var favorite, dawg, time, spread, total, odds;
    var json = {time: "", favorite: "", spread: "", dawg: "", total: "", odds: ""};

    var data = $("td > b:contains('Money Odds')").first().parent().parent().next();
    json.time = data.children("td:nth-child(1)").text();
    json.favorite = data.children("td:nth-child(2)").text();
    json.spread = data.children("td:nth-child(3)").text();
    json.dawg = data.children("td:nth-child(4)").text();
    json.total = data.children("td:nth-child(5)").text();
    json.odds = data.children("td:nth-child(6)").text();

}

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send('Check your console!')

    }) ;
})

app.listen('1989')
console.log('Magic happens on port 1989');
exports = module.exports = app;

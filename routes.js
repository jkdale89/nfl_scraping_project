var express = require('express')
    , fs = require('fs')
    , request = require('request')
    , cheerio = require('cheerio')
    , mongoose = require('mongoose')
    , app = express();


    db = mongoose.createConnection('mongodb://localhost:27017/nfl');


// set view engine to hbs
app.set('view engine', 'hbs');
// app.set('views', '/views')

app.get("/index", function(req, res){
  res.send(db.collection('lines'));
})

app.listen('1989')
console.log('LETS GAMBLE');
exports = module.exports = app;

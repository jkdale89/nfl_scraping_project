
var lines_mnf = function(week, write){
    var request = require('request'), cheerio = require('cheerio'), fs = require('fs'), results = [];
    url = "http://www.footballlocks.com/nfl_odds_week_" + week.toString() + ".shtml";
    request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);
          for(var i = 2006; i <= 2015; i++){
            var year_str = i.toString();
            //lets grab the first block of games
            //lets grab the monday night football games
            var data = $("b:contains('Monday Night Football Odds'):contains('" + year_str + "')").parent().parent().parent().next().eq(0).find("tr:has(td)");
            // console.log(data);
            var result = [];
            for(var j = 1; j <= 3; j ++){
              var temp = {
                "time" : data.eq(j).children().eq(0).text(),
                "spread" : parseFloat(data.eq(j).children().eq(2).text()),
                "fav" : data.eq(j).children().eq(1).text(),
                "dog" : data.eq(j).children().eq(3).text(),
                "week" : week,
                "year" : i
              }
              var fav = data.eq(j).children().eq(1).text()
                , dog = data.eq(j).children().eq(3).text()
                , odds = data.eq(j).children().eq(5).text()
                , total = data.eq(j).children().eq(4).text()
                , home = ""
                , away = ""
                ;

                //sometimes the lines will have '(At London)' or '(Toronto)' - let's correct this
                if(fav.indexOf('(') > 0){
                  temp.fav = fav.substring(0, fav.indexOf('('));
                }

                //same thing, for underdog
                if(dog.indexOf('(') > 0){
                  temp.dog = dog.substring(0, dog.indexOf('('));
                }

                if(fav.indexOf('\n') > 0){
                  temp.fav = fav.substring(0, fav.indexOf('\n'));
                }

                if(dog.indexOf('\n') > 0){
                  temp.dog = dog.substring(0, dog.indexOf('\n'));
                }

                if((fav.indexOf("At ") + 1) === 1){
                  temp.fav = fav.slice(3, fav.length);
                  home = temp.fav;
                  away = temp.dog;
                }

                else if((dog.indexOf("At ") + 1) === 1) {
                  temp.dog = dog.slice(3, dog.length);
                  home = temp.dog;
                  away = temp.fav;
                }

                else {
                  home = temp.dog;
                  away = temp.fav;
                }

                temp.home = home
                , temp.away = away;

                // create a unique id for removing duplicates, in a sec;
                temp.id = temp.time + temp.fav + temp.spread;
                // create a unique id for matching with results file
                temp.id_match = home + away + temp.week.toString() + temp.year.toString();
                // create an alternate id for matching with results files
                // this is for when the home and away teams get switched up
                temp.id_match_alt = away + home + temp.week.toString() + temp.year.toString();
                temp.total = parseInt(total);
                temp.ml_fav = odds.substring(0, odds.indexOf(" "));
                temp.ml_dog = odds.substring(odds.indexOf(" ") + 1, odds.length);

              //make sure empty objects don't get pushed
              if(temp.time){
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
          // console.log(result);
          results.push(result);
        }
        console.log(results)
      }
      var week_display = (week / 10) < 1 ? "0" : "";
      fs.writeFile("../exports/lines/lines_week_" + week_display + week + "_mnf" + ".js", JSON.stringify(results, 6, "\t") + (week === 16 ? "" : ","), function(){
        console.log("check ./exports/lines.json for the output");
      })
    })
  }



  var pop_lines = function(){
    for(var i = 1; i <= 16; i++){
      lines_mnf(i);
    }
  }

  pop_lines();

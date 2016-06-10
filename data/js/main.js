var fs = require('fs'),

    games = require("./exports/games.js"),
    // lines = require("./exports/lines/agg.js"),

    cleanup = require("./scripts/cleanup.js"),
    iterate = require("./scripts/iterate_teams.js"),
    merge = require("./scripts/merge_sources.js"),
    scrape = require("./scripts/scrape.js"),
    teams_key = require("./scripts/populate_teams_key.js"),

    newResults = [],
    newLines = [],

    no_games = games.length,
    arr = [],
    master = {},
    total = [];

var pop_lines = function(){
  for(var i = 1; i <= 16; i++){
    scrape.lines(i);
  }
}

pop_lines();







// script for shell to aggregate lines - use in the ./exports/lines/ file
// cat * > aggregate.js

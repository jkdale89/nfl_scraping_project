var fs = require('fs'),

    games = require("./exports/games.js"),

    cleanup = require("./scripts/cleanup.js"),
    iterate = require("./scripts/iterate_teams.js"),
    merge = require("./scripts/merge_sources.js"),
    scrape = require("./scripts/scrape.js"),
    teams_key = require("./scripts/populate_teams_key.js"),

    newResults = [],
    newLines = [],

    no_games = games.length,
    arr = [],
    master = {};

    scrape.lines(1);

"use strict"

let scanner = require("./scanner.js");
let parser = require("./parser.js");
let result = function(tokens) {
    console.log(JSON.stringify(parser.parse(tokens)));
}

scanner.scan(process.argv[2], result);
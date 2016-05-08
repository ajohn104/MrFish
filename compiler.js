"use strict"

let scanner = require("./scanner.js");
let result = function(tokens) {
    console.log(scanner.parseTokensToStringSpacially(tokens));
}

scanner.scan(process.argv[2], result);
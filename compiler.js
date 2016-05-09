"use strict"

let scanner = require("./scanner.js");
let parser = require("./parser.js");
let fs = require('fs');

let result = function(tokens) {
    var code = parser.parse(tokens).toJS();
    var compileDest = process.argv[2].match(/^.*(?=\.fish)/)[0] + '.js';
    if(compileDest.match(/^[^\/]*$/)) {
        compileDest = './' + compileDest;
    }
    fs.writeFileSync(compileDest, code);
}

scanner.scan(process.argv[2], result);
var Tokens = require('./tokens'),
    fs = require('fs'),
    byline = require('byline');
    //error = require('./output').scanError;

 
var scan = function(file, callback) {
    var stream = fs.createReadStream(file);
    stream = byline.createStream(stream, { encoding: 'utf8', keepEmptyLines: true });

    var scanner = new LineScanner();
    var tokens = [];
    
    stream.on('readable', function() {
        var line;
        while (null !== (line = stream.read())) {
            var allValid = scanner.nextLine(line);
            if(!allValid) {
                error(scanner.errorToken);
                callback(false);
                return;
            }
        }
    });
    stream.on('end', function() {
        tokens = scanner.complete();
        if(typeof callback !== "undefined") {
            callback(tokens);
        }
    });
};

var scanLine = function(line, callback) {
    var scanner = new LineScanner();
    var valid = scanner.nextLine(line);
    if(!valid) {
        error(scanner.errorToken);
        callback(false);
        return;
    }
    if(typeof callback !== 'undefined') {
        callback(scanner.complete());
    }
};

var scanLineSync = function(line, lineNumber, column, isTruncating) {
    var lineNumber = (typeof lineNumber === "undefined"? 0: lineNumber);
    var column = (typeof column === "undefined"? 0: column);
    var isTruncating = (typeof isTruncating === "undefined"? false: isTruncating);
    var scanner = new LineScanner();
    scanner.lineNumber = lineNumber;
    scanner.isTruncating = isTruncating;
    var valid = scanner.nextLine(line);
    if(!valid) return false;
    var tokens = scanner.complete();
    tokens.pop();
    for(var i = 0; i < tokens.length; i++) {
        tokens[i].column = column;
    }
    return tokens;
};

var truncate = function(str) {
    var list = ["\"\""];
    while(str.length > 0) {
        var match = str.match(/^([^\\]*\\(\\\\)*(\$\{[^\}]+\}|[^\$]))*?[^\\]*?(\\\\)*\$\{[^\}]+\}/);
        if(!match) {
            if(str.length > 2) {
                list.push(str);
            }
            str = "";
        } else {
            var fullMatchString = match[0];
            var refMatch = fullMatchString.match(/\$\{[^\}]+\}$/);
            if(refMatch.index === 1) {
                list.push(refMatch[0].substring(2, refMatch[0].length-1));
                str = str.charAt(str.length-1) + str.substring(fullMatchString.length);
            } else {
                list.push(str.substring(0, refMatch.index) + str.charAt(0));
                list.push(refMatch[0].substring(2, refMatch[0].length-1));
                str = str.charAt(str.length-1) + str.substring(fullMatchString.length);
            }
        }
    }
    var retStr = list[0];
    var startIndex = 1;
    if(list.length > 1 && (list[1].charAt(0) === "\"" || list[1].charAt(0) === "\'")) {
        retStr = list[1];
        startIndex = 2;
    }

    for(var j = startIndex; j < list.length; j++) {
        retStr += " + " + list[j];
    }
    return retStr;
};

var parseTokensToStringFull = function(tokens){
    var str = "";
    for(var i = 0; i < tokens.length; i++ ) {
        str += tokens[i]['kind'] + "( '" + tokens[i]['lexeme'] + "' ), ";
    }
    return str;
};

var parseTokensToStringPretty = function(tokens) {
    var str = "";
    for(var i = 0; i < tokens.length; i++ ) {
        if(tokens[i]['kind'] === 'Newline') {
            str += "\n\'\\n\'";
        } else {
            str += " \'"+ tokens[i]['lexeme'] + "\'";
        }
    }
    return str;
};

var parseTokensToStringBest = function(tokens) {
    var str = "";
    for(var i = 0; i < tokens.length; i++ ) {
        var abbr = null;
        var token = tokens[i];
        for(var j = 0; j < Tokens.kinds.length; j++) {
            var pair = Tokens.kinds[j];
            if(pair.kind === token.kind) {
                abbr = pair.abbr;
                break;
            }
        }
        if(abbr === null) {
            var lexeme = token['lexeme'];
            lexeme = (lexeme === Tokens['Indent'][0])?'\\t':lexeme;
            str += (lexeme === "\\n")?'\n':'';
            var spacing = (lexeme === "\\n")?'':' ';
            str += spacing + "\'" + lexeme + "\'";
        } else {
            str += " " + abbr + "(\'" + tokens[i]['lexeme'] + "\')";
        }
    }
    return str;
};

var parseTokensToStringSpacially = function(tokens) {
    var str = "";
    var indent = "    ";
    var charCount = 0;
    for(var i = 0; i < tokens.length; i++ ) {
        if(tokens[i]['kind'] === 'Newline') {
            str += "\nNewline ";
            charCount = "Newline ".length;
        } else {
            var newStr = tokens[i]['kind'] + "('" + tokens[i]['lexeme'] + "'), ";
            if(newStr.length + charCount > 80) {
                charCount = indent.length;
                str += "\n" + indent;
            }
            str += tokens[i]['kind'] + "('" + tokens[i]['lexeme'] + "'), ";
            charCount += newStr.length;
        }
    }
    return str;
};

var INDENT = function(lineNumber) {
    return {kind:"Indent", lexeme:"INDENT", line: lineNumber}
}

var NEWLINE = function(lineNumber) {
    return {kind:"Newline", lexeme:"\n", line: lineNumber}
}

var DEDENT = function(lineNumber) {
    return {kind:"Dedent", lexeme:"DEDENT", line: lineNumber}
}

var LineScanner = function() {
    this.lineNumber = 0;
    this.columnNumber = 0;
    this.tokens = [];
    this.indentLevel = 0;
    this.errorToken = null;
    /*this.isTruncating = false;*/  // I'm pretty sure this was for string interpolation. I'm not gonna rewrite this if I don't have to
    this.nextLine = function(line) {
        //console.log(line);
        this.lineNumber++;
        //var charAt = 1;
        //var indentsOnThisLine = [];
        if(/^\n?\s*(>>).*$/.test(line)) {
            return true;
        }
        var indentLevelCurr = 0;
        while(/^    /.test(line)) {
            line = line.substring(4);
            indentLevelCurr++;
        }
        if(/^  /.test(line)) {
            line = line.substring(2);
            indentLevelCurr += 0.5;
        }
        /* 
         * If prev at whole indent level:
         *      If indent level went up by 0.5:
         *          -user did not finish previous expression, don't do anything.
         *      If indent level went up by 1:
         *          -user indented then newlined
         *      If indent level went down by 0.5:
         *          -error, not possible. Would require unfinished expression but was not in one.
         *      If indent level went down by 1:
         *          -user dedented then newlined
         *      If indent level remained the same:
         *          -user newlined
         * If prev at fractional indent level:
         *      If indent level went up by 0.5:
         *          -user indented then newlined (they also finished an expression, but we can ignore that)
         *      If indent level went up by 1:
         *          -error, not possible. I don't allow blocks within expressions.
         *      If indent level went down by 0.5:
         *          -user newlined (they also finished an expression, but we can ignore that)
         *      If indent level went down by 1:
         *          -error, not possible. That would have required being IN a block in an expression.
         *      If indent level stayed the same:
         *          -user did not finish previous expression, don't do anything.
         */
        if(this.tokens.length > 0 && this.tokens[this.tokens.length-1].kind === "Newline") this.tokens.pop();
        if (this.indentLevel % 1 === 0) {
            switch(this.indentLevel - indentLevelCurr) {
                case 0.5:
                    break;
                case 1:
                    this.tokens.push(INDENT(this.lineNumber));
                    this.tokens.push(NEWLINE(this.lineNumber));
                    break;
                case -0.5:
                    console.error("Scan Error: indentation not possible. Would require unfinished expression but was not in one.");
                    return false;
                case -1:
                    this.tokens.push(DEDENT(this.lineNumber));
                    this.tokens.push(NEWLINE(this.lineNumber));
                    break;
                case 0:
                    this.tokens.push(NEWLINE(this.lineNumber));
                    break;
                default:
                    console.error("Scan error: impossible indent level reached.");
                    return false;
            }
         } else if (this.indentLevel % 1 === 0.5) {
            switch(this.indentLevel - indentLevelCurr) {
                case 0.5:
                    this.tokens.push(INDENT(this.lineNumber));
                    this.tokens.push(NEWLINE(this.lineNumber));
                    break;
                case 1:
                    console.error("Scan error: impossible indent level reached.");
                    return false;
                case -0.5:
                    this.tokens.push(NEWLINE(this.lineNumber));
                case -1:
                    console.error("Scan error: impossible indent level reached.");
                    return false;
                case 0:
                    break;
                default:
                    console.error("Scan error: impossible indent level reached.");
                    return false;
            }
        } else {
            console.error("Scan error: impossible indent level reached.");
            return false;
        }

        while(line.length > 0) {
            while(line.charAt(0) === " ") {
                this.columnNumber++;
                line = line.substring(1);
            }
            var token = this.getNextToken(line);
            if(token === null) {
                if(!/\S/.test(line)) {
                    return true;
                }
                console.error("Scan error: Impossible token found.");
                return false;
            }
            if(token.kind === "Comment") {
                return true;
            }
            this.tokens.push(token);
            this.columnNumber += token.lexeme.length;
            line = line.substring(token.lexeme.length);
            /*if(!this.inMultilineComment) {
                var token = this.getNextToken(line, contentHasAppeared);
                if(token === null) {
                    break;
                }
                if(this.isSinglelineComment(token)) {
                    line = "";
                    break;
                } 
                if(this.isMultilineComment(token)) {
                    this.inMultilineComment = true;
                    line = line.substring(2);
                    charAt += 2;
                    continue;
                }
                if(this.isIndent(token) && !contentHasAppeared) {
                    charAt+= token.index;
                    token.column = charAt;
                    var tokenIndex = token.index;
                    delete token.index;
                    indentsOnThisLine.push(token);
                    line = line.substring(token.lexeme.length + tokenIndex);
                    charAt += token.lexeme.length;
                    continue;
                }
                var hasAppearedBefore = contentHasAppeared;
                contentHasAppeared = (!this.isIndent(token))?true:contentHasAppeared;
                if(hasAppearedBefore !== contentHasAppeared) {
                    for(var k = indentsOnThisLine.length; k < this.indentsInPreviousLine; k++) {
                        var prev = this.tokens.pop();
                        this.tokens.push({kind:"Dedent", lexeme:"\\d", line: this.lineNumber});
                        this.tokens.push(prev);
                    }
                    for(var l = this.indentsInPreviousLine; l < indentsOnThisLine.length; l++) {
                        var prev = this.tokens.pop();
                        this.tokens.push({kind:"Indent", lexeme:"INDENT", line: this.lineNumber});
                        this.tokens.push(prev);
                    }
                    this.indentsInPreviousLine = indentsOnThisLine.length;
                }
                if(token.kind === "UnexpectedChars" || token.kind === "Unused") {
                    this.errorToken = token;
                    token.line = this.lineNumber;
                    token.index = charAt;
                    return false;
                }
                charAt += token.index;
                token.line = this.lineNumber;
                token.column = charAt;
                var tokenIndex = token.index;
                var tokenLength = token.lexeme.length;
                delete token.index;
                if(token.kind === "StrLit" && !this.isTruncating) {
                    var truncated = truncate(token.lexeme);
                    var tokens = scanLineSync(truncated, this.lineNumber, token.column, true);
                    this.tokens = this.tokens.concat(tokens);
                } else {
                    this.tokens.push(token);
                }
                line = line.substring(tokenLength + tokenIndex);
                charAt += tokenLength;
                continue;
            } else {
                var characterNumber = line.indexOf(Tokens.Comment[2]);
                if(characterNumber >= 0) {
                    this.inMultilineComment = false;
                    line = line.substring(characterNumber+2);
                    charAt += characterNumber+2;
                } else {
                    line = "";
                    break;
                }
            }*/
            //console.log("current status of line{ line length: " + line.length + ", line: " + line);
        }
        /*(var lastToken = this.getLastToken();
        if(!this.inMultilineComment && typeof lastToken !== "undefined" && !this.isNewline(lastToken)) {
            var token = {kind: "Newline", lexeme:"\\n", line: this.lineNumber+1};
            this.tokens.push(token);
        }*/
        return true;
    };
    this.getLastToken = function() {
        return this.tokens[this.tokens.length-1];
    };
    this.isNewline = function(token) {
        return token.lexeme === "\\n";
    };
    this.isSinglelineComment = function(token) {
        return token.lexeme === Tokens.Comment[0];
    };
    this.isIndent = function(token) {
        return token.lexeme === Tokens.Indent[0];
    };
    var getBestMatch = function(line, array, wordBreak) {
        wordBreak = (typeof wordBreak === "undefined")?false:wordBreak;
        var index = -1;
        var arrayIndex = -1;
        for(var i = 0; i < array.length; i++) {
            var token = array[i];
            var tokenIndex;
            if(wordBreak) {
                tokenIndex = line.search(new RegExp(token + "\\b"));
            } else {        // I know I could have used the ?: here, but I wanted to ensure laziness.
                tokenIndex = line.indexOf(token);
            }
            if(index === -1 || (tokenIndex >= 0 && tokenIndex < index)) {
                index = tokenIndex;
                arrayIndex = i;
            }
        }
        return {index: index, arrayIndex:arrayIndex};
    };
    var getMatch = function(line, kind, wordBreak) {
        var matchIndexes = getBestMatch(line, Tokens[kind], wordBreak);
        var matchIndex = matchIndexes['index'];
        if(matchIndex === -1) return null;
        var size = Tokens[kind][matchIndexes['arrayIndex']].length;
        var match = line.substring(matchIndex, matchIndex + size);
        var token = {kind: kind, lexeme: match, index: matchIndex};
        return token;
    };
    var getMatchReg = function(line, kind, regexStr) {
        var start = null;
        var matches = line.match(new RegExp(regexStr));
        if(matches === null) return null;
        var match = matches[0], 
            matchIndex = matches['index'];
        var token = {kind: kind, lexeme: match, index: matchIndex};
        return token;
    };
    var getOperatorMatch = function(line) {
        var matchIndex, size;
        matchIndex = getBestMatch(line, Tokens.OneCharacterOperators)['index'];
        if(matchIndex >= 0) size = 1;
        var newMatchIndexes = getBestMatch(line, Tokens.WordOperators, true);
        if(newMatchIndexes['index'] !== -1 && newMatchIndexes['index'] <= matchIndex) {
            matchIndex = newMatchIndexes['index'];
            size = Tokens.WordOperators[newMatchIndexes['arrayIndex']].length;
        }
        
        if(matchIndex === -1) return null;
        var match = line.substring(matchIndex, matchIndex + size);
        var token = {kind: "Operator", lexeme: match, index: matchIndex};
        return token;
    };
    var getSeparatorMatch = function(line) {
        return getMatch(line, "Separator");
    };
    var getIdMatch = function(line) {
        return getMatchReg(line, "Id", "[_$a-zA-Z][$\\w]*(?=[^$\\w]|$)");
    };
    var getIntMatch = function(line) {
        return getMatchReg(line, "IntLit", "[+-]?((0x[a-fA-F0-9]+)|(\\d+(\\.\\d+)?([eE][+-]?\\d+)?))");
    };
    // newest string literal regex courtesy of arcain from StackOverflow
    var getStrMatch = function(line) {      
        return getMatchReg(line, "StrLit", "\\\"[^\\\"\\\\]*(?:\\\\.[^\\\"\\\\]*)*\\\"|\\\'[^\\\'\\\\]*(?:\\\\.[^\\\'\\\\]*)*\\\'");
    };
    var getBoolMatch = function(line) {
        return getMatch(line, "BoolLit", true);
    };
    var getCommentMatch = function(line) {
        return getMatch(line, "Comment");
    };
    var getReservedMatch = function(line) {
        return getMatch(line, "Reserved", true);
    };
    var getUnusedMatch = function(line) {
        return getMatch(line, "Unused", true);
    };
    var tokenFunctions = [
        getReservedMatch, getUnusedMatch, getBoolMatch,
        getCommentMatch, getOperatorMatch, getSeparatorMatch,
        getStrMatch, getIntMatch, getIdMatch
    ];
    this.getNextToken = function(line) {
        var token = null;
        // Syntax: $(id)
        //var one = 1;
        //var another = "the last";
        //console.log(getMatch(line, "Reserved"));

        //"here is a string...";
        //"here is another string with $(one) reference";
        var tokenOptions = [];
        for(var i = 0; i < tokenFunctions.length; i++) {
            var token = tokenFunctions[i](line);
            var priority = i;
            if(priority > 3) priority++;
            if(token !== null) {
                tokenOptions.push({token:token, priority: priority});
            }
        }
        var option = null;
        for(var j = 0; j < tokenOptions.length; j++) {
            var newToken = tokenOptions[j];
            if(option === null) {
                option = newToken;
                continue;
            }
            var betterIndex = newToken.token.index < option.token.index;
            var betterPriority = (newToken.token.index === option.token.index) && (newToken.priority < option.priority);
            if(betterIndex || betterPriority) {
                option = newToken;
            }
        }
        var cutout = line.substring(0, (option !== null)?(option.token.index):(line.length));
        if(cutout.length > 0 && cutout.search(/^\x20+$/) === -1) {
            // Error report goes here. Unexpected characters, basically.
            // This should only be entered if the next token found has non-space characters
            // between it and the previous token (or beginning of line). Note: a tab is NOT
            // considered to be a space character. In other words, tabs are not allowed.
            return {kind: "UnexpectedChars", lexeme: cutout, index: 0};
        }
        if(option === null) {
            return null;
        }
        return option.token;
    };
    this.complete = function() {
        /*for(var i = 0; i < this.indentsInPreviousLine; i++) {
            var prev = this.tokens.pop();
            this.tokens.push({kind:"Dedent", lexeme:"DEDENT", line: this.lineNumber});
            this.tokens.push(prev);
        }
        if(this.tokens[this.tokens.length-1].kind === "Newline") {
            this.tokens.pop();
        }*/
        return this.tokens;
    };
};
var Scanner = {
    scan: scan,
    scanLine: scanLine,
    parseTokensToStringFull: parseTokensToStringFull,
    parseTokensToStringPretty: parseTokensToStringPretty,
    parseTokensToStringBest: parseTokensToStringBest,
    parseTokensToStringSpacially: parseTokensToStringSpacially
}

module.exports = Scanner;
var output = require('./output');
var error = output.parseError;
var ERROR = output.parseErrorObject;

var Program = require("./types/program.js");
var Block = require("./types/block.js");
var Declaration = require("./types/declaration.js");
var Assignment = require("./types/assignment.js");
var IfStmt = require("./types/ifStmt.js");
var ElseIf = require("./types/elseIf.js");
var Else = require("./types/else.js");
var While = require("./types/while.js");
var ForIn = require("./types/forIn.js");
var ForOf = require("./types/forOf.js");
var Return = require("./types/return.js");
var FuncDef = require("./types/functionDef.js");
var Func = require("./types/function.js");
var TypeDef = require("./types/typeDef.js");
var Property = require("./types/property.js");
var ObjectDef = require("./types/objectDef.js");
var Call = require("./types/call.js");
var ArrayLit = require("./types/arrayLit.js");
var This = require("./types/this.js");
var Exp = require("./types/exp.js");
var Exp1 = require("./types/exp1.js");
var Exp2 = require("./types/exp2.js");
var Exp3 = require("./types/exp3.js");
var Exp4 = require("./types/exp4.js");
var Exp5 = require("./types/exp5.js");
var Exp6 = require("./types/exp6.js");
var Exp7 = require("./types/exp7.js");
var Exp8 = require("./types/exp8.js");
var Parenthetical = require("./types/parenthetical.js");
var Id = require("./types/id.js");
var BoolLit = require("./types/boolLit.js");
var IntLit = require("./types/intLit.js");
var StringLit = require("./types/stringLit.js");

var callback = undefined;

var parse = function(tokens) {
    var parser = new TokenStreamParser(tokens);
    return parser.parseProgram();
};

var ID = {kind: "Id"};
var STRING = {kind: "StrLit"};
var INT = {kind: "IntLit"};
var BOOL = {kind: "BoolLit"};
var NEWLINE = {kind:"Newline"};
var INDENT = {kind: "Indent"};
var DEDENT = {kind: "Dedent"};
var COMPAREOP = ["equal_to", "not_equal_to", "greater_than", "less_than", "less_than_or_equal_to", "greater_than_or_equal_to"];
var ADDOP = ["+", "-"];
var MULOP = ["*", "/", "mod"];
var PREFIXOP = ["not", "-"];
var POWEROP = "^";

var TokenStreamParser = function(tokens) {
    var at = function(expected, lookahead) {
        if(tokens.length === 0) return false;
        var lookahead = (typeof lookahead === "undefined")?0:lookahead;
        if(lookahead >= tokens.length) return false;
        if(Array.isArray(expected)) {
            return expected.indexOf(tokens[0].lexeme) >= 0;
        } else if(typeof expected === "string") {
            return tokens[lookahead].lexeme === expected;
        } else {
            // This would be used for ints, strings, 
            return tokens[lookahead].kind = expected.kind;
        }
    };

    var match = function(expected, lookahead) {
        if(tokens.length === 0) return null;
        var lookahead = (typeof lookahead === "undefined")?0:lookahead;
        if(lookahead >= tokens.length) return ERROR;
        if(Array.isArray(expected)) {
            if(expected.indexOf(tokens[0].lexeme) >= 0) {
                return tokens.shift();
            }
        } else if(typeof expected === "string") {
            if(tokens[lookahead].lexeme === expected) {
                return tokens.shift();
            }
        } else {
            // This would be used for ints, strings, 
            if(tokens[lookahead].kind = expected.kind) {
                return tokens.shift();
            }
        }
    };

    this.parseProgram = function() {
        match(NEWLINE);
        var stmt = parseStmt();
        var block = parseBlock();
        return new Program(stmt, block);
    };

    var parseBlock = function() {
        var stmts = [];
        while(at(NEWLINE)) {
            match(NEWLINE);
            stmts.push(parseStmt());
        }
        return new Block(stmts);
    };

    var parseStmt = function() {
        if(at('declare')) {
            return parseDeclaration();
        } else if (at(ID) && at('=', 1)) {
            return parseAssignment();
        } else if (at('if')) {
            return parseIfStmt();
        } else if (at('foreach') || at('while')) {
            return parseLoop();
        } else if (at('provide')) {
            return parseReturn();
        } else if (at('function')) {
            return parseFunctionDef();
        } else if (at('type')) {
            return parseTypeDef();
        } else {
            return parseExp();  // TODO: Needs some kind of error system
        }
    };

    var parseDeclaration = function() {
        match('declare');
        var id = match(ID);
        if (at('as')) match('as');
        else if (at('=')) match('=');

        if(at('properties')) {
            return new Declaration(id, parseObject(id));
        } else {
            return new Declaration(id, parseExp());
        }
    };

    var parseAssignment = function() {
        var id = match(ID);
        match('=');
        if(at('properties')) {
            return new Assignment(id, parseObject(id));
        } else {
            return new Assignment(id, parseExp());
        }
    };

    var parseIfStmt = function() {
        match('if');
        match('(');
        var exp = parseExp();
        match(')');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        var elseIfs = [];
        while(at(NEWLINE) && at('else', 1) && at('if', 2)) {
            elseIfs.push(parseElseIf());
        }
        var finalElse;
        if(at(NEWLINE) && at('else', 1)) {
            finalElse = parseElse();
        }
        return new IfStmt(exp, block, elseIfs, finalElse);
    };

    var parseElseIf = function() {
        match('else');
        match('if');
        match('(');
        var exp = parseExp();
        match(')');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new ElseIf(exp, block);
    };

    var parseElse = function() {
        match('else');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new Else(exp);
    };

    var parseLoop = function() {
        if(at('while')) {
            return parseWhile();
        } else if(at('foreach') && at('(', 1) && at(ID, 2) &&  at('in', 3)) {
            return parseForIn();
        } else {
            return parseForOf();
        }
    };

    var parseWhile = function() {
        match('while');
        match('(');
        var exp = parseExp();
        match(')');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new While(exp, block);
    };

    var parseForIn = function() {
        match('foreach');
        match('(');
        var id = match(ID);
        match('in');
        var exp = parseExp();
        match(')');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new ForIn(id, exp, block);
    };

    var parseForOf = function() {
        match('foreach');
        match('(');
        var id = match(ID);
        match('of');
        var exp = parseExp();
        match(')');
        match(':');
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new ForOf(id, exp, block);
    };

    var parseReturn = function() {
        match('provide');
        var exp;
        if(!at(NEWLINE)) {
            exp = parseExp();
        }
        return new Return(exp);
    };

    var parseFunctionDef = function() {
        match('function');
        return new FuncDef(parseFunction());
    };

    var parseFunction = function() {
        var id = match(ID);
        match('needs');
        match('(');
        var valueMapping = [];
        if(at(ID)) {
            var idInner = match(ID);
            var value;
            if(at('=')) {
                match('=');
                value = parseExp();
            }
            valueMapping.push({prop: idInner, val: value});
            while(at(',')) {
                value = undefined;
                idInner = match(ID);
                if(at('=')) {
                    match('=');
                    value = parseExp();
                }
                valueMapping.push({prop: idInner, val: value});
            }
        }
        match(INDENT);
        var block = parseBlock();
        match(DEDENT);
        return new Func(id, valueMapping, block);
    };

    var parseTypeDef = function() {
        match('type');
        var id = match(ID);
        var idExt;
        if(at('as')) {
            match('as');
            idExt = match(ID);
        }
        match(':');
        match(INDENT);
        var props = [];
        var methods = [];

        while(at(NEWLINE)) {
            if(at(ID) && at(':', 1)) {
                props.push(parseProperty());
            } else {
                methods.push(parseFunction());
            }
        }  
        match(DEDENT);
        return new TypeDef(id, idExt, props, methods);
    };

    var parseProperty = function() {
        var left;
        if(at(INT)) {
            left = match(INT);
        } else if(at(STRING)) {
            left = match(STRING);
        } else if(at(BOOL)) {
            left = match(BOOL);
        } else {
            left = match(ID);
        }
        match(':');
        var right = parseExp();
        return new Property(left, right);
    };

    var parseObject = function(id) {        // Giving it id to make life easier on me.
        match('properties');
        match(':');
        match(INDENT);
        match(NEWLINE);
        var props = [];
        var methods = [];

        props.push(parseProperty());
        while(at(NEWLINE)) {
            match(NEWLINE);
            if(at(ID) && at(':', 1)) {
                props.push(parseProperty());
            } else {
                methods.push(parseFunction());
            }
        }
        match(DEDENT);
        return new ObjectDef(props, methods, id);
    };

    var parseExp = function() {
        var exp1s = [parseExp1()];
        while(at('or')) {
            match('or');
            exp1s.push(parseExp1());
        }
        return new Exp(exp1s);
    };

    var parseExp1 = function() {
        var exp2s = [parseExp2()];
        while(at('and')) {
            match('and');
            exp2s.push(parseExp2());
        }
        return new Exp1(exp2s);
    };

    var parseExp2 = function() {
        var exp3s = [parseExp3()];
        while(at(COMPAREOP)) {
            var op = match(COMPAREOP);
            exp3s.push({op: op, exp: parseExp3()});
        }
        return new Exp2(exp3s);
    };

    var parseExp3 = function() {
        var exp4s = [parseExp4()];
        while(at(ADDOP)) {
            var op = match(ADDOP);
            exp4s.push({op: op, exp: parseExp4()});
        }
        return new Exp3(exp4s);
    };

    var parseExp4 = function() {
        var exp5s = [parseExp5()];
        while(at(MULOP)) {
            var op = match(MULOP);
            exp5s.push({op: op, exp: parseExp5()});
        }
        return new Exp4(exp5s);
    };

    var parseExp5 = function() {
        var prefix;
        if(at(PREFIXOP)) {
            prefix = match(PREFIXOP);
        }
        var exp6 = parseExp6();
        return new Exp5(prefix, exp6);
    };

    var parseExp6 = function() {
        var exp7 = parseExp7();
        var power;
        if(at(POWEROP)) {
            match(POWEROP);
            power = parseExp6();
        }
        return new Exp6(exp7, power);
    };

    var parseExp7 = function() {
        if(at('new')) {
            match('new');
            var exp8 = parseExp8();
            var call = parseCall();
            return new Exp7(exp8, call);
        } 
        return parseExp8();
    };

    var parseExp8 = function() {
        var exp9 = parseExp9();
        var call;
        var dot;
        var bracketAccess;
        if(at('with')) {
            call = parseCall();    
        } else if(at('.')) {
            dot = parseExp8();
        } else if(at('[')) {
            match('[');
            bracketAccess = parseExp8();
            match(']');
        }
        return new Exp8(exp9, call, dot, bracketAccess);     // exp8 is special as it takes in call, dot, and bracketAccess, and deal with whichever it gets.
    };

    var parseExp9 = function() {
        if(at(ID)) {
            return new Id(match(ID));
        } else if(at(BOOL)) {
            return new BoolLit(match(BOOL));
        } else if(at(INT)) {
            return new IntLit(match(INT));
        } else if(at(STRING)) {
            return new StringLit(match(STRING));
        } else if(at('(')) {
            match('(');
            var exp = parseExp();
            match(')');
            return new Parenthetical(exp);
        } else if(at('[')) {
            return parseArrayLit();
        } else {
            return parseThis();
        }
    }

    var parseCall = function() {
        match('with');
        match('(');
        var valueMapping = [];
        if(at(ID)) {
            var id = match(ID);
            match('=');
            var exp = parseExp();
            valueMapping.push({prop: id, val: exp});
            while(at(',')) {
                match(',');
                id = match(ID);
                match('=');
                exp = parseExp();
                valueMapping.push({prop: id, val: exp});
            }
        }
        match(')');
        return new Call(valueMapping);
    };

    var parseArrayLit = function() {
        match('[');
        var values = [];
        if(!at(']')) {
            values.push(parseExp());
            while(at(',')) {
                match(',');
                values.push(parseExp());
            }
        }
        match(']');
        return new ArrayLit(values);
    };

    var parseThis = function() {
        match('this');
        return new This();
    };

};

var Parser = {
    parse: parse
}

module.exports = Parser;
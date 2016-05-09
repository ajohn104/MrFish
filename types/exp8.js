// Exp8           ::= Exp9 (Call | '.' Exp8 | '[' Exp8 ']')

var Exp8 = function(exp, call, dot, bracketAccess) {
	this.exp = exp;
	this.call = call;
	this.dot = dot;
	this.bracketAccess = bracketAccess;
}

module.exports = Exp8;
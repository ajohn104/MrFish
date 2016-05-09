// Exp8           ::= Exp9 (Call | '.' Exp8 | '[' Exp8 ']')

var Exp8 = function(exp, call, dot, bracketAccess) {
	this.exp = exp;
	this.call = call;
	this.dot = dot;
	this.bracketAccess = bracketAccess;
	this.toJS = function() {
		if(typeof this.call !== "undefined") {
			return this.exp.toJS() + this.call.toJS();
		} else if(typeof this.dot !== "undefined") {
			return this.exp.toJS() + "." + this.dot.toJS();
		} else if(typeof this.bracketAccess !== "undefined") {
			return this.exp.toJS() + "[" + this.bracketAccess.toJS() + "]";
		}
		return this.exp.toJS();
	};
}

module.exports = Exp8;
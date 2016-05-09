// Exp5           ::= PrefixOp? Exp6

var translateOp = {
	"not" : "!",
	"-" : "-"
}

var Exp5 = function(prefix, exp) {
	this.prefix = prefix;
	this.exp = exp;
	this.toJS = function() {
		return ((typeof prefix === "undefined")?"":translateOp[prefix]) + this.exp.toJS();
	};
}

module.exports = Exp5;
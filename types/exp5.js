// Exp5           ::= PrefixOp? Exp6

var Exp5 = function(prefix, exp) {
	this.prefix = prefix;
	this.exp = exp;
}

module.exports = Exp5;
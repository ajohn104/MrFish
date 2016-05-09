// Exp3           ::= Exp4 (AddOp Exp4)*

var Exp3 = function(exps) {
	this.exps = exps;
}

module.exports = Exp3;
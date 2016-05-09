// Exp2           ::= Exp3 (CompareOp Exp3)*

var Exp2 = function(exps) {
	this.exps = exps;
}

module.exports = Exp2;
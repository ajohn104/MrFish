// Exp4           ::= Exp5 (MulOp Exp5)*

var Exp4 = function(exps) {
	this.exps = exps;
}

module.exports = Exp4;
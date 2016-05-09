// Exp1            ::= Exp2 ('and' Exp2)*

var Exp1 = function(exps) {
	this.exps = exps;
}

module.exports = Exp1;
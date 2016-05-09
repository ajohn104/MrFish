// Exp            ::= Exp1 ('or' Exp1)*

var Exp = function(exps) {
	this.exps = exps;
}

module.exports = Exp;
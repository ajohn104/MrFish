// Exp6           ::= Exp7 (PowerOp Exp6)?

var Exp6 = function(exp, power) {
	this.exp = exp;
	this.power = power;
}

module.exports = Exp6;
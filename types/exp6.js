// Exp6           ::= Exp7 (PowerOp Exp6)?

var Exp6 = function(exp, power) {
	this.exp = exp;
	this.power = power;
	this.toJS = function() {
		return "Math.pow(" + exp.toJS() + ", " + ((typeof this.power === "undefined")?"1":this.power.toJS()) + ")";
	};
}

module.exports = Exp6;
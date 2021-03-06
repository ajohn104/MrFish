// Exp            ::= Exp1 ('or' Exp1)*

var Exp = function(exps) {
	this.exps = exps;
	this.toJS = function() {
		var str = "";
		this.exps.forEach(function() {
			str += "(";
		});
		str += this.exps[0].toJS();
		for(var i = 1; i < this.exps.length; i++) {
			str += ") && " + this.exps[i].toJS();
		}

		str += ")";
		return str;
	};
}

module.exports = Exp;
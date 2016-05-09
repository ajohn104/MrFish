// Exp4           ::= Exp5 (MulOp Exp5)*

var Exp4 = function(exps) {
	this.exps = exps;
	this.toJS = function() {
		var str = "";
		this.exps.forEach(function() {
			str += "(";
		});
		str += this.exps[0].toJS();
		for(var i = 1; i < this.exps.length; i++) {
			str += ") " + this.exps[i].op.lexeme + " " + this.exps[i].exp.toJS();
		}

		str += ")";
		return str;
	};
}

module.exports = Exp4;
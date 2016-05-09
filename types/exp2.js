// Exp2           ::= Exp3 (CompareOp Exp3)*

var translateOp = {
	"equal_to" : "===", 
	"not_equal_to" : "!==", 
	"greater_than" : ">", 
	"less_than" : "<", 
	"less_than_or_equal_to" : ">=", 
	"greater_than_or_equal_to" : "<="
}

var Exp2 = function(exps) {
	this.exps = exps;
	this.toJS = function() {
		var str = "";
		this.exps.forEach(function() {
			str += "(";
		});
		str += this.exps[0].toJS();
		for(var i = 1; i < this.exps.length; i++) {
			str += ") " + translateOp[this.exps[i].op.lexeme] + " " + this.exps[i].exp.toJS();
		}

		str += ")";
		return str;
	};
}

module.exports = Exp2;
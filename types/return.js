// Return          ::= 'provide' Exp?

var Return = function(exp) {
	this.exp = exp;
	this.toJS = function() {
		return "return" + ((typeof this.exp === "undefined")?"":(" " + this.exp.toJS())) + ";";
	};
}

module.exports = Return;
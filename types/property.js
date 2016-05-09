// Prop            ::= (Id | StringLit | Intlit | BoolLit) ':' Exp

var Prop = function(left, right) {
	this.propName = left;
	this.value = right;
	this.toJS = function() {
		return this.propName.lexeme + ":" + this.value.toJS();
	};
}

module.exports = Prop;
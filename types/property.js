// Prop            ::= (Id | StringLit | Intlit | BoolLit) ':' Exp

var Prop = function(left, right) {
	this.propName = left;
	this.value = right;
}

module.exports = Prop;
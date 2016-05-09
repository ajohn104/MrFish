// ArrayLit        ::= '[' (Exp (',' Exp)* )? ']'

var ArrayLit = function(values) {
	this.values = values;
}

module.exports = ArrayLit;
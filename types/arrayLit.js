// ArrayLit        ::= '[' (Exp (',' Exp)* )? ']'

var ArrayLit = function(values) {
	this.values = values;
	this.toJS = function() {
		var str = "[";
		this.values.forEach(function(value) {
			str += value.toJS();
		});
		str += "]";
		return str;
	}
}

module.exports = ArrayLit;
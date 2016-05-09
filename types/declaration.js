// Declaration     ::= 'declare' Id ('as' | '=') (Obj | Exp)

var Declaration = function(id, value) {
	this.id = id;
	this.value = value;
	this.toJS = function() {
		return "var " + this.id.lexeme + "=" + this.value.toJS() + ";\n";
	};
}

module.exports = Declaration;
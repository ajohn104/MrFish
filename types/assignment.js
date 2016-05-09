// Assignment      ::= Id '=' (Object | Exp)

var Assignment = function(id, value) {
	this.id = id;
	this.value = value;
	this.toJS = function() {
		return this.id.lexeme + "=" + this.value.toJS() + ";\n";
	}
}

module.exports = Assignment;
// Assignment      ::= Id '=' (Object | Exp)

var Assignment = function(id, value) {
	this.id = id;
	this.value = value;
}

module.exports = Assignment;
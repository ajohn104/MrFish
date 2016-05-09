// Declaration     ::= 'declare' Id ('as' | '=') (Obj | Exp)

var Declaration = function(id, value) {
	this.id = id;
	this.value = value;
}

module.exports = Declaration;
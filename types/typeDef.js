// TypeDef         ::= 'type' Id ('as' Id)? ':' Indent (Newline (Func | Property))* Dedent 

var TypeDef = function(id, idExt, properties, methods) {
	this.id = id;
	this.idExt = idExt;
	this.properties = properties;
	this.methods = methods;
}

module.exports = TypeDef;
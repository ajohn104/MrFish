// TypeDef         ::= 'type' Id ('as' Id)? ':' Indent (Newline (Func | Property))* Dedent 

var insertConstructor = function(id) {
	return {
		toJS: function() {
			return id + ".call(this);";
		}
	}
}

var TypeDef = function(id, idExt, properties, methods) {
	this.id = id;
	this.idExt = idExt;
	this.props = properties;
	this.methods = methods;
	var self = this;
	this.toJS = function() {
		var str = "var " + this.id.lexeme + " = function() {\n"

		this.props.forEach(function(prop) {
			str += "this." + prop.propName.lexeme + " = " + prop.value.toJS() + ";\n";
		});

		str += "};\n";
		if(typeof this.idExt !== "undefined") {
			str += this.id.lexeme + ".prototype = Object.create( " + this.idExt.lexeme + ".prototype);";
		}
		this.methods.forEach(function(method) {
			if(method.id.lexeme === "Creation") {
				method.id = {lexeme: "constructor"};
				method.block.stmts.shift(insertConstructor(self.id.lexeme));
			}
			str += self.id.lexeme + ".prototype." + method.toJS() + ";\n";
		});
		return str;
	}
}

module.exports = TypeDef;
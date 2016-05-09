// Obj             ::= 'properties' ':' Indent Newline (Func | Property) (Newline (Func | Property))* Dedent

var Obj = function(props, methods, id) {
	this.props = props;
	this.methods = methods;
	this.id = id;
	this.toJS = function() {
		var str = "{\n";
		this.props.forEach(function(prop) {
			str += prop.toJS() + ",\n";
		});
		if(this.props.length > 0) {
			str = str.substring(0, str.length-1);
		}
		str += "};\n";
		this.methods.forEach(function(method) {
			str += id.lexeme + "." + method.toJS() + ";\n";
		});
		return str;
	};
}

module.exports = Obj;
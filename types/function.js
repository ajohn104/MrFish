// Func            ::= Id 'needs' '(' (Id ('=' Exp)? (',' Id ('=' Exp)? )* )? ')' ':' Indent Block Dedent

var Func = function(id, params, block) {
	this.id = id;
	this.params = params;
	this.block = block;
	this.toJS = function() {
		var str = this.id.lexeme + " = function(provide) {\n";
		this.params.forEach(function(param) {
			this.str += "var " + param.prop.lexeme + " = provide["+ param.prop.lexeme + "]";
			if(typeof param.val !== "undefined") {
				str += " = (typeof provide." + param.prop.lexeme + "=== \"undefined\")?" + ((param.val.toJS !== "undefined")?param.val.toJS():param.val.lexeme) + ":" + "provide." + param.prop.lexeme;
			}
			str += ";\n";
		});
		this.str += this.block.toJS();
		this.str += "}";
		return str;
	};
}

module.exports = Func;
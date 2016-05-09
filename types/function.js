// Func            ::= Id 'needs' '(' (Id ('=' Exp)? (',' Id ('=' Exp)? )* )? ')' ':' Indent Block Dedent

var Func = function(id, params, block) {
	this.id = id;
	this.params = params;
	this.block = block;
	this.toJS = function() {
		var str = this.id.lexeme.lexeme + "= function(provide) {\n";
		this.params.forEach(function(param) {
			this.str += "var " + param.prop.lexeme + " = (typeof provide." + param.prop.lexeme + "=== \"undefined\")?" + param.val + ":" + "provide." + param.prop.lexeme + ";\n"; 
		});
		this.str += this.block.toJS();
		this.str += "}";
		return str;
	};
}

module.exports = Func;
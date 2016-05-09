// Func            ::= Id 'needs' '(' (Id ('=' Exp)? (',' Id ('=' Exp)? )* )? ')' ':' Indent Block Dedent

var Func = function(id, params, block) {
	this.id = id;
	this.params = params;
	this.block = block;
}

module.exports = Func;
// ForOf           ::= 'foreach' '(' Id 'of' Exp ')' ':' Indent Block Dedent

var ForOf = function(id, exp, block) {
	this.id = id;
	this.exp = exp;
	this.block = block;
	this.toJS = function() {
		return this.exp.toJS() + ".forEach(function( provide, " + this.id.lexeme + ") {\n" + this.block.toJS() + "}\n";
	};
}

module.exports = ForOf;
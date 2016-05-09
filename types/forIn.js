// ForIn           ::= 'foreach' '(' Id 'in' Exp ')' ':' Indent Block Dedent

var ForIn = function(id, exp, block) {
	this.id = id;
	this.exp = exp;
	this.block = block;
	this.toJS = function() {
		return this.exp.toJS() + ".forEach(function(" + this.id.lexeme + ") {\n" + this.block.toJS() + "}\n";
	};
}

module.exports = ForIn;
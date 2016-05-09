// ForIn           ::= 'foreach' '(' Id 'in' Exp ')' ':' Indent Block Dedent

var ForIn = function(id, exp, block) {
	this.id = id;
	this.exp = exp;
	this.block = block;
}

module.exports = ForIn;
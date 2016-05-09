// ForOf           ::= 'foreach' '(' Id 'of' Exp ')' ':' Indent Block Dedent

var ForOf = function(id, exp, block) {
	this.id = id;
	this.exp = exp;
	this.block = block;
}

module.exports = ForOf;
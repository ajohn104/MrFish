// While           ::= 'while' '(' Exp ')' ':' Indent Block Dedent

var While = function(exp, block) {
	this.exp = exp;
	this.block = block;
}

module.exports = While;
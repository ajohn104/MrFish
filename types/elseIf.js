// ElseIf          ::= 'else' 'if'  '(' Exp ')' ':' Indent Block Dedent

var ElseIf = function(exp, block) {
	this.exp = exp;
	this.block = block;
}

module.exports = ElseIf;
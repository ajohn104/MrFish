// IfStmt          ::= 'if' '(' Exp ')' ':' Indent Block Dedent (Newline ElseIf)* (Newline Else)?

var IfStmt = function(exp, block, elseIfs, finalElse) {
	this.exp = exp;
	this.block = block;
	this.elseIfs = elseIfs;
	this.finalElse = finalElse;
}

module.exports = IfStmt;
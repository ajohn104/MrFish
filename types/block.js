// Block           ::= (Newline Stmt)*
var Block = function(stmts) {
	this.stmts = stmts;
}

module.exports = Block;
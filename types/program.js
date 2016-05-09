// Program         ::= Stmt Block?
var Block = require("./block.js");
var Program = function(initStatement, block) {
	if(block != null) {
		this.block = block;
		this.block.stmts.unshift(initStatement);
	} else {
		this.block = new Block([initStatement]);
	}
}

module.exports = Program;
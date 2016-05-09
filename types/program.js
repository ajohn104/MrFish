// Program         ::= Stmt Block?
var Block = require("./block.js");

var builtIns = "var Output = function(provide) {console.log(provide.text);};\n";
builtIns += "var random = function() { return Math.random(); }\n";

var Program = function(initStatement, block) {
	if(typeof block !== "undefined") {
		this.block = block;
		this.block.stmts.unshift(initStatement);
	} else {
		this.block = new Block([initStatement]);
	}
	this.toJS = function() {
		return builtIns + this.block.toJS();
	};
}

module.exports = Program;
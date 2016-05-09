// Block           ::= (Newline Stmt)*
var Block = function(stmts) {
	this.stmts = stmts;
	this.toJS = function() {
		var str = "";
		this.stmts.forEach(function(stmt) {
			str += stmt.toJS();
		});
		return str;
	}
}

module.exports = Block;
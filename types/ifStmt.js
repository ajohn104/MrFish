// IfStmt          ::= 'if' '(' Exp ')' ':' Indent Block Dedent (Newline ElseIf)* (Newline Else)?

var IfStmt = function(exp, block, elseIfs, finalElse) {
	this.exp = exp;
	this.block = block;
	this.elseIfs = elseIfs;
	this.finalElse = finalElse;
	this.toJS = function() {
		var str = "";
		str += "else if(" + this.exp.toJS() + ") {\n" + this.block.toJS() + "}\n";
		this.elseIfs.forEach(function(elseif) {
			str += elseif.toJS();
		});
		if(typeof this.finalElse !== "undefined") {
			str += this.finalElse.toJS();
		}
		return str;
	};
}

module.exports = IfStmt;
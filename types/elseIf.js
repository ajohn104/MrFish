// ElseIf          ::= 'else' 'if'  '(' Exp ')' ':' Indent Block Dedent

var ElseIf = function(exp, block) {
	this.exp = exp;
	this.block = block;
	this.toJS = function() {
		return "else if(" + this.exp.toJS() + ") {\n" + this.block.toJS() + "}\n";
	};
}

module.exports = ElseIf;
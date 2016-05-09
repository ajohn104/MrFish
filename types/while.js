// While           ::= 'while' '(' Exp ')' ':' Indent Block Dedent

var While = function(exp, block) {
	this.exp = exp;
	this.block = block;
	this.toJS = function() {
		return "while(" + this.exp.toJS() + ") {\n" + this.block.toJS() + "}\n";
	};
}

module.exports = While;
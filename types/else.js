// Else            ::= 'else' ':' Indent Block Dedent

var Else = function(block) {
	this.block = block;
	this.toJS = function() {
		return "else {\n" + this.block.toJS() + "}\n";
	};
}

module.exports = Else;
// Else            ::= 'else' ':' Indent Block Dedent

var Else = function(block) {
	this.block = block;
}

module.exports = Else;
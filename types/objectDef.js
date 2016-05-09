// Obj             ::= 'properties' ':' Indent Newline Property (Newline Property)* Dedent

var Obj = function(props) {
	this.props = props;
}

module.exports = Obj;
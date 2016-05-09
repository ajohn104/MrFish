// Call            ::= 'with' '(' (Id '=' Exp (',' Id '=' Exp)* )? ')'

var Call = function(args) {
	this.args = args;
}

module.exports = Call;
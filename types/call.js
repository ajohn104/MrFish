// Call            ::= 'with' '(' (Id '=' Exp (',' Id '=' Exp)* )? ')'

var Call = function(args) {
	this.args = args;
	this.toJS = function() {
		var str = "({";
		this.args.forEach(function(arg) {
			str += arg.prop.lexeme + ":" + arg.val.toJS() + ",";
		})
		if(args.length > 1) {
			str = str.substring(0, str.length-1);
		}
		str += "})";
		return str;
	};
}

module.exports = Call;
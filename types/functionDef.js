// FuncDef         ::= 'function' Func

var FuncDef = function(func) {
	this.func = func;
	this.toJS = function() {
		return "var " + this.func.toJS() + ";";
	};
}

module.exports = FuncDef;
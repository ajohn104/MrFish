// Exp7           ::= ('new' Exp8 Call) | Exp8
// If we're here, it's really just ('new' Exp8 Call)

var Exp7 = function(exp, call) {
	this.exp = exp;
	this.call = call;
	this.toJS = function() {
		return "new " + exp.toJS() + call.toJS();
	};
}

module.exports = Exp7;
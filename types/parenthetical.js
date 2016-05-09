// just here for convenience

var Parenthetical = function(exp) {
	this.exp = exp;
	this.toJS = function() {
		return "(" + this.exp.toJS() + ")";
	};
}

module.exports = Parenthetical;
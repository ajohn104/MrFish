// Here for convience

var BoolLit = function(bool) {
	this.bool = bool;
	this.toJS = function() {
		return this.bool.lexeme;
	}
}

module.exports = BoolLit;
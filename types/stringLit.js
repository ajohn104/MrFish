// Here for convience

var StringLit = function(string) {
	this.string = string;
	this.toJS = function() {
		return this.string.lexeme;
	};
}

module.exports = StringLit;
// Here for convience

var IntLit = function(intVal) {
	this.num = num;
	this.toJS = function() {
		return this.num.lexeme;
	};
}

module.exports = IntLit;
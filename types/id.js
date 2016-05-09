// Here for convience

var Id = function(id) {
	this.id = id;
	this.toJS = function() {
		return this.id.lexeme;
	}
}

module.exports = Id;
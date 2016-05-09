// this <-- just because it makes my life easier for reasons

var This = function() {
	this.toJS = function() {
		return "this";
	};
}

module.exports = This;
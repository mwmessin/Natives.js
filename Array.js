
Array.implement({

	isArray: true,

	add: function (array) {
		this.push.apply(this, array);
		return this;
	},

	index: function (i) {
		if (this.length) while (i < 0) i += this.length;
		return this[i];
	},

	contains: function (object) {
		return this.indexOf(object) !== -1;
	},

	remove: function (object) {
		var index = this.indexOf(object);
		if (index === -1 ) return;
		this.splice(index, 1);
		return this;
	},

	pushUnique: function (object) {
		if (this.contains(object)) return this;
		this.push(object);
		return this;
	}

});

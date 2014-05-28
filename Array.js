
Array.implement({

	isArray: true,

	toString: function () {
		return JSON.stringify(this);
	},

	add: function (array) {
		this.push.apply(this, array);
		return this;
	},

	index: function (i) {
		if (this.length) while (i < 0) i += this.length;
		return this[i];
	},

	last: function () {
		return this[this.length - 1];
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

	from: function (object) {
		var result = {};

		for (var i = 0, l = this.length; i < l; ++i) {
			result[this[i]] = object[this[i]];
		}

		return result;
	},

	sortBy: function (method) {
		return this.sort(function (a, b) {
			if (method.isString) return b[method].toNumber() - a[method].toNumber();
			else return method(b).toNumber() - method(a).toNumber();
		});
	},

	pushUnique: function (object) {
		if (this.contains(object)) return this;
		this.push(object);
		return this;
	},

	random: function () {
		return this[random() * this.length | 0];
	},

	max: function () {
		return Math.max.apply(Math, this);
	},

	min: function () {
		return Math.min.apply(Math, this);
	},

	sum: function () {
		var sum = 0;

		for (var i = 0, l = this.length; i < l; ++i) {
			sum += this[i];
		}

		return sum;
	},

	mean: function () {
		return this.sum() / this.length;
	},

	stdDev: function () {
		var devs = 0;
		var mean = this.mean();

		for (var dev, i = 0, l = this.length; i < l; ++i) {
			dev = this[i] - mean;
			devs += dev * dev;
		}

		return sqrt(devs / this.length);
	}
	
});

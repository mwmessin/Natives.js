
Array.implement({

	isArray: true,

	toString: JSON.stringify.methodize(JSON),

	add: function (array) {
		this.push.apply(this, array);
		return this;
	},

	append: function () {
		this.push.apply(this, arguments);
		return this;
	},

	prepend: function () {
		this.unshift.apply(this, arguments);
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

	unique: function () {
		var result = [];

		for (var i = 0, l = this.length; i < l; ++i) {
			if (result.contains(this[i])) continue;
			result.push(this[i]);
		}

		return result;
	},

	random: function () {
		return this[random() * this.length | 0];
	},

	shuffle: function () {
		var result = [], clone = this.slice(0);

		while (clone.length) {
			result.push(clone.splice(random() * clone.length, 1));
		}

		return result;
	},

	max: function () {
		return Math.max.apply(Math, this);
	},

	min: function () {
		return Math.min.apply(Math, this);
	},

	or: function () {
		var result = null;

		for (var i = 0, l = this.length; i < l; ++i) {
			result = result || this[i];
		}

		return result;
	},

	and: function () {
		var result = null;

		for (var i = 0, l = this.length; i < l; ++i) {
			result = result && this[i];
		}

		return result;
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

	median: function () {
		return this[this.length / 2];
	},

	stdDev: function () {
		var devs = 0;
		var mean = this.mean();

		for (var variance, i = 0, l = this.length; i < l; ++i) {
			variance = this[i] - mean;
			devs += variance * variance;
		}

		return sqrt(devs / this.length);
	}
	
});


function load(key) {
	return localStorage[key].toObject();
}

Object.implement({

	isObject: true,

	toString: JSON.stringify.methodize(JSON),

	toArray: function () {
		return Array.prototype.slice.call(this, 0);
	},

	toCSON: function (depth) {
		var space = '&nbsp;', depth = depth || 1;
		var pretty = '';

		for (var key in this) {
			var value = this[key];

			if (! (value == null || value.isNumber || value.isString)) {
				value = '<br>' + value.toCSON(depth + 1);
			}

			pretty += space.times(depth * 2) + key + ': ' + value + '<br>';
		}

		return pretty;
	},

	save: function (key) {
		localStorage[key] = this;
		return this;
	},

	erase: function (key) {
		localStorage.removeItem(key);
		return this;
	},

	keys: Object.getOwnPropertyNames.methodize() || function () {
		var result = [];

		for (var key in this) {
			result.push(key);
		}

		return result;
	},

	values: function () {
		var result = [];

		for (var key in this) {
			result.push(this[key]);
		}

		return result;
	},

	only: function (keys) {
		var result = {};

		if (keys.isString) keys = arguments;

		for (var i = 0, l = keys.length; i < l; ++i) {
			var key = keys[i];
			result[key] = this[key];
		}

		return result;
	},

	has: function (keys) {
		if (! keys.isArray) keys = keys.keys();

		for (var i = 0, l = keys.length; i < l; ++i) {
			var key = keys[i];
			if (! this.hasOwnProperty(key)) return false;
		}

		return true;
	},

	equals: function (object) {
		for (var key in this) {
			if (object[key] != this[key]) return false;
		}

		return true;
	},

	extend: function (object) {
		for (var key in object) {
			this[key] = object[key];
		}

		return this;
	},

	defaults: function (object) {
		for (var key in object) {
			if (this[key] == null) this[key] = object[key];
		}

		return this;
	},

	into: function (object) {
		object.extend(this);
		return this;
	},

	enhance: function (type) {
		type.implement(this);
		return this;
	},

	each: function (callback) {
		for (var key in this) {
			callback(this[key], key);
		}

		return this;
	},

	map: function (callback) {
		var result = {};

		for (var key in this) {
			result[key] = callback(this[key], key);
		}

		return result;
	},

	mapKeys: function (callback) {
		var result = {};

		for (var key in this) {
			result[callback(key)] = this[key];
		}

		return result;
	},

	reduce: function (accumulator, callback) {
		var result = accumulator || {};

		for (var key in this) {
			result = callback(result, this[key], key);
		}

		return result;
	},

	serialize: function (pairsDelimeter, pairDelimeter) {
		// convert an object into a key-value string
		var pairs = [];

		for (var key in this) {
			pairs.push(key + pairDelimeter + this[key]);
		}

		return pairs.join(pairsDelimeter);
	},

	callsString: function (callsDelimeter) {
		// convert a methods-args hash into a string
		var calls = [];

		for (var key in this) {
			calls.push(key + '(' + this[key] + ')');
		}

		return calls.join(callsDelimeter);
	},

	freeze: Object.freeze.methodize(),

	seal: Object.seal.methodize()

});

['slice', 'unshift', 'push', 'append', 'prepend', 'add']
	.from(Array.prototype)
	.enhance(Object);

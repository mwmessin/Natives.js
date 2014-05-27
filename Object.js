
Object.implement({

	isObject: true,

	toString: function () {
		return JSON.stringify(this);
	},

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

	load: function (key) {
		return localStorage[key].toObject();
	},

	keys: function () {
		var result = [];

		for (var key in this) {
			result.push(key);
		}

		return result;
	},

	only: function () {
		var result = {};

		for (var i = 0, l = arguments.length; i < l; ++i) {
			var key = arguments[i];
			result[key] = this[key];
		}

		return result;
	},

	extend: function (object) {
		for (var key in object) {
			this[key] = object[key];
		}

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

	destructure: function (pairsDelimeter, pairDelimeter) {
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
	}

});

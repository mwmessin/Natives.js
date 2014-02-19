
function load (key) {
	return localStorage[key].toObject();
}

Object.implement({

	isObject: true,

	toString: function () {
		return JSON.stringify(this);
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

	xhr: function (options) {
		var xhr = new XMLHttpRequest();
		var url = options.to;

		if (options.params) url += '?' + options.params.delimString('&', '=');

		xhr.addEventListener('load', function () {
			console.log(xhr.status, xhr);
			options.success(xhr.response);
		}, false);

		xhr.open(options.method || 'get', url, true);
		xhr.send();
	},

	// 
	delimString: function (pairsDelimeter, pairDelimeter) {
		var pairs = [];

		for (var key in this) {
			pairs.push(key + pairDelimeter + this[key]);
		}

		return pairs.join(pairsDelimeter);
	},

	// 
	callsString: function (callsDelimeter) {
		var calls = [];

		for (var key in this) {
			calls.push(key + '(' + this[key] + ')');
		}

		return calls.join(callsDelimeter);
	}

});

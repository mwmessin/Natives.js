
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
		// 
		var calls = [];

		for (var key in this) {
			calls.push(key + '(' + this[key] + ')');
		}

		return calls.join(callsDelimeter);
	},

	xhr: function (options) {
		var xhr = new XMLHttpRequest();
		var url = options.to;

		if (options.params) url += '?' + options.params.destructure('&', '=');

		options.success && xhr.addEventListener('load', function () {
			console.log(xhr.status, xhr);
			options.success(xhr.response);
		}, false);

		options.error && xhr.addEventListener('error', function () {
			console.error(xhr.status, xhr);
			options.error(xhr.response);
		}, false);

		xhr.open(options.method || 'get', url, true);
		xhr.send();
	},

	GET: function (url, success, error) {
		return this.xhr({
			method: 'get',
			to: url,
			params: this,
			success: success,
			error: error
		});
	},

	POST: function (url, success, error) {
		return this.xhr({
			method: 'post',
			to: url,
			params: this,
			success: success,
			error: error
		});
	},

	PUT: function (url, success, error) {
		return this.xhr({
			method: 'put',
			to: url,
			params: this,
			success: success,
			error: error
		});
	},

	DELETE: function (url, success, error) {
		return this.xhr({
			method: 'delete',
			to: url,
			params: this,
			success: success,
			error: error
		});
	}

});

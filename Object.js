
Object.implement({

	isObject: true,

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

		xhr.addEventListener('load', function () {
			console.log(xhr.status, xhr.response);
		}, false);

		xhr.open(options.method, options.to, true);
		xhr.send();
	},

	post: function (options) {
		this.xhr(options.extend({
			method: 'post'
		}));
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

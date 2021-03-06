
String.implement({

	isString: true,

	$: function () {
		return this.toElement().$();
	},

	toInt: parseInt.methodize(),

	toNumber: parseFloat.methodize(),

	toObject: JSON.parse.methodize(JSON),

	toElement: document.createElement.methodize(document),

	toDashCase: function () {
		return this.replace(/([A-Z])|_(.)/g, function (match, first, second, offset) {
			return (offset > 0 ? '-' : '') + (first || second).toLowerCase();
		});
	},

	toSnakeCase: function () {
		return this.replace(/([A-Z])|-(.)/g, function (match, first, second, offset) {
			return (offset > 0 ? '_' : '') + (first || second).toLowerCase();
		});
	},

	toCamelCase: function () {
		return this.replace(/-(.)|_(.)/g, function (match, first, second, offset) {
			return (first || second).toUpperCase();
		});
	},

	save: function (key) {
		localStorage[key] = '"' + this + '"';
		return this;
	},

	times: function (count) {
		var result = '';
		while (count--) result += this;
		return result;
	},

	padLeft: function(length, ch) {
		if (this.length < length) {
			return ch.times(length - this.length) + this;
		} else {
			return this;
		}
	},

	sum: function (bignum) {
		var longest = this.length.max(bignum.length),
				a = this.padLeft(longest, '0'),
				b = bignum.padLeft(longest, '0'),
				result = '',
				carry = 0;

		for (var i = longest - 1; i >= 0; --i) {
			part = +a[i] + +b[i] + carry;
			carry = part / 10 | 0;
			result = (part % 10) + result;
		}

		return carry > 0 ? carry + result : result;
	},

	colorHexToDec: function () {
		return [
			this.substring(1,3).toInt(16), 
			this.substring(3,5).toInt(16), 
			this.substring(5,7).toInt(16)
		];
	},

	parse: function (pairsDelimeter, pairDelimeter) {
		// convert a key-value string into an object
		var result = {};
		var pairs = this.split(pairsDelimeter);

		if (this == '') return result;

		for (var i = 0, l = pairs.length; i < l; ++i) {
			var pair = pairs[i].split(pairDelimeter);
			result[pair[0]] = pair[1];
		}

		return result;
	},

	callsObject: function (callsDelimeter) {
		var result = {};
		var calls = this.split(callsDelimeter);

		if (this == '') return result;

		for (var i = 0, l = calls.length; i < l; ++i) {
			var call = calls[i].match(/(.*)\((.*)\)/);
			result[call[1]] = call[2];
		}

		return result;
	},

	contains: function (string) {
		return this.indexOf(string) !== -1;
	},

	extract: function (regex) {
		var match = this.match(regex);
		return match ? match[1] : null;
	},

	matches: function (regex) {
		return this.match(regex) != null;
	},

	stem: function () {
		var postfixes = [
			'able', 'ac', 'acity', 'age', 'ate',
			'e', 'ed', 'en',
			'ful', 'fy', 'fier',
			'hood',
			'i?ty', 'ian', 'ic', 'ie', 'ing', 'ious', 'ism', 'ite', 'ive',
			'ling', 'ly',
			'ship', 'sion', 'some',
			'tion', 'tude',
			'ward', 'ware',
			'y'
		];
		return this.extract(new RegExp('(.+)' + postfixes.join('s?|(.+)') + 's?'))
	},

	prefixStyle: function () {
		var style = document.body.style;
		if (style[this] != null) return this;
		if (style['-ms-' + this] != null) return '-ms-' + this;
		if (style['-moz-' + this] != null) return '-moz-' + this;
		if (style['-webkit-' + this] != null) return '-webkit-' + this;
		return this;
	}

});

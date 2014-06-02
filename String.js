
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
		return this.replace(/[A-Z]/g, function (match, offset) {
			return (offset > 0 ? '-' : '') + match.toLowerCase();
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

	colorHexToDec: function () {
		return [
			this.substring(1,3).toInt(16), 
			this.substring(3,5).toInt(16), 
			this.substring(5,7).toInt(16)
		];
	},

	structure: function (pairsDelimeter, pairDelimeter) {
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
	}

});

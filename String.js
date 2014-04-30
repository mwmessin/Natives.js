
String.implement({

	isString: true,

	$: function () {
		return this.toElement().$();
	},

	toInt: function (base) {
		return parseInt(this, base);
	},

	toNumber: function (base) {
		return parseFloat(this, base);
	},

	toObject: function () {
		return JSON.parse(this);
	},

	toElement: function () {
		return document.createElement(this);
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

	delimObject: function (pairsDelimeter, pairDelimeter) {
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

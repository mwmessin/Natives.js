
function log() {
	console.log.apply(console, arguments);
}

function warn() {
  console.warn.apply(console, arguments);
}

function error() {
  console.error.apply(console, arguments);
}

Function.prototype.implement = function (members) {
	var key, prototype = this.prototype;

	for (key in members) {
		if (members[key] != prototype[key]) {
			if (prototype.hasOwnProperty(key)) {
				warn('overwriting "' + key + '" in ' + (this.name || this) + '.prototype');
			}

			Object.defineProperty(prototype, key, {
				value: members[key],
				enumerable: false
			});
		}
	}
};

Function.implement({

	isFunction: true,

	leastFixedPoint: function (i) {
		var next = this(i);

		while (i != next) {
			i = next;
			next = this(i);
		}

		return i;
	},

	methodize: function (context) {
		var callback = this;

		return function () {
			return callback.apply(context, [this].add(arguments));
		}
	},

	memoize: function () {
		var callback = this, memo = {};

		return function () {
			return memo[arguments.toString()] || (memo[arguments.toString()] = callback.apply(null, arguments));
		}
	},

	curry: function () {
		var callback = this, args = arguments;

		return function () {
			return callback.apply(null, args.add(arguments));
		}
	},

	bind: Function.prototype.bind || function (context) {
		var callback = this, args = arguments.slice(1);

		return function () {
			return callback.apply(context, args.add(arguments));
		}
	},

	debounce: function (wait) {
		var callback = this, timeout;

		return function () {
			var args = arguments;

			clearTimeout(timeout);
			timeout = setTimeout(function () {
				callback.apply(null, args);
			}, wait); 
		};
	},

	throttle: function (wait) {
		var callback = this, timeout, args;

		return function () {
			args = arguments;

			if (! timeout) {
				timeout = setTimeout(function () {
					callback.apply(null, args);
					clearTimeout(timeout);
				}, wait);
			}
		};
	},

	timeout: function (wait) {
		return setTimeout(this, wait);
	},

	interval: function (wait) {
		return setInterval(this, wait);
	},

	defer: function () {
		return setTimeout(this, 1);
	}

});

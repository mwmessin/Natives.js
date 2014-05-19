
function alias(method) {
	return function () {
		return this[method].apply(this, arguments);
	}
}

Function.prototype.implement = function (members) {
	var key, prototype = this.prototype;

	for (key in members) {
		if (members[key] != prototype[key]) {
			if (prototype[key]) {
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

	methodize: function (context) {
		var callback = this;

		return function () {
			return callback.apply(context, [this].add(arguments));
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

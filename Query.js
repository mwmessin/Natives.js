
function $(selector) {
	if (selector.isFunction) return selector.defer();

	var create = selector.extract(/<(.*)>/);
	if (create) return create.$();
	return new Query(selector);
}

function Query(object) {
	if (! object) return;
	if (object.isString) return this.add(document.querySelectorAll(object));
	if (object.isElement) return this.add([object]);
	if (object.isArray) return this.add(object);
}

Query.extend({

	prototype: new Array(),

	invoker: function (key) {
		return function () {
			if (arguments.length == 0 && this[0]) return this[0][key]();

			for (var i = 0, l = this.length; i < l; ++i) {
				this[i][key].apply(this[i], arguments);
			}

			return this;
		}
	},

	transformer: function (key) {
		return function () {
			var transforms = [];

			for (var transform, i = 0, l = this.length; i < l; ++i) {
				transform = this[i][key].apply(this[i], arguments);
				transform.isQuery ? transforms.add(transform) : transforms.push(transform);
			}

			return new Query(transforms);
		}
	}

});

Query.implement({

	isQuery: true,

	style: function (key, value) {
		for (var i = 0, l = this.length; i < l; ++i) {
			this[i].style[key] = value;
		}

		return this;
	},

	to: Query.invoker('to'),

	border: Query.invoker('border'),

	borderRadius: Query.invoker('borderRadius'),

	center: Query.invoker('center'),

	children: function (selector) {
		var matches = [];

		for (var i = 0, l = this.length; i < l; ++i) {
			var children = this[i].children;

			if (selector) {
				for (var c = 0, cl = children.length; c < cl; ++c) {
					var child = children[c];
					if (child.matches(selector)) matches.push(child);
				}
			} else {
				matches.add(children);
			}
		}

		return new Query(matches);
	},

	closest: Query.transformer('closest'),

	find: Query.transformer('find')

});

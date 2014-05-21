
function $(selector) {
	if (selector.isFunction) return selector.defer();
	if (selector.isString) {
		var create = selector.extract(/<(.*)>/);
		if (create) return create.$();
	}
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
			// call a method on each item in a collection
			if (arguments.length == 0 && this[0]) return this[0].prototype[key].apply(this[i], []);

			for (var i = 0, l = this.length; i < l; ++i) {
				this[i].prototype[key].apply(this[i], arguments);
			}

			return this;
		}
	},

	transformer: function (key) {
		return function () {
			// call a method on each item in a collection returning the results
			var transforms = [];

			for (var transform, i = 0, l = this.length; i < l; ++i) {
				transform = this[i][key].prototype[key].apply(this[i], arguments);
				transform.isQuery ? transforms.add(transform) : transforms.push(transform);
			}

			return new Query(transforms);
		}
	}

});

Query.implement({

	isQuery: true,

	touchstart: Query.invoker('touchstart'),

	touchstart: Query.invoker('touchstart'),

	touchend: Query.invoker('touchend'),

	touchcancel: Query.invoker('touchcancel'),

	touchleave: Query.invoker('touchleave'),

	touchmove: Query.invoker('touchmove'),

	mousemove: Query.invoker('mousemove'),

	mouseover: Query.invoker('mouseover'),

	mouseout: Query.invoker('mouseout'),

	mouseenter: Query.invoker('mouseenter'),

	mouseleave: Query.invoker('mouseleave'),

	scroll: Query.invoker('scroll'),

	mouseup: Query.invoker('mouseup'),

	mousedown: Query.invoker('mousedown'),

	contextmenu: Query.invoker('contextmenu'),
	
	keyup: Query.invoker('keyup'),

	keydown: Query.invoker('keydown'),

	keypress: Query.invoker('keypress'),

	style: function (key, value) {
		for (var i = 0, l = this.length; i < l; ++i) {
			this[i].style[key] = value;
		}

		return this;
	},

	appendTo: Query.invoker('appendTo'),

	width: Query.invoker('width'),

	height: Query.invoker('height'),

	border: Query.invoker('border'),

	attr: Query.invoker('attr'),

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

	find: Query.transformer('find'),

	context2d: Query.invoker('context2d'),

	context3d: Query.invoker('context3d')

});

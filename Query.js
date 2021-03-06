
function $(selector) {
	if (selector.isQuery) return selector;
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
			// call a method on each item in a Query set
			if (arguments.length == 0 && this[0]) return this[0].prototype[key].apply(this[0], []);

			for (var i = 0, l = this.length; i < l; ++i) {
				this[i].prototype[key].apply(this[i], arguments);
			}

			return this;
		}
	},

	transformer: function (key) {
		return function () {
			// call a method on each item in a Query set, returning the results
			var transforms = [];

			for (var transform, i = 0, l = this.length; i < l; ++i) {
				transform = this[i].prototype[key].apply(this[i], arguments);
				transform.isQuery ? transforms.add(transform) : transforms.push(transform);
			}

			return new Query(transforms);
		}
	}

});

['touchstart', 'touchend', 'touchcancel', 'touchleave', 'touchmove', 'drag',
 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'scroll',
 'ended', 'progress', 'loadeddata', 'loadedmetadata', 'canplay', 'start', 'load',
 'mouseup', 'mousedown', 'contextmenu', 'dragenter', 'dragover', 'drop', 'keyup', 
 'keydown', 'keypress', 'error',
 'width', 'height', 'position', 'top', 'right', 'bottom', 'left', 'attr',
 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 
 'paddingVertical', 'paddingHorizontal', 'paddingRight', 'paddingBottom', 
 'paddingLeft', 'opacity', 'border', 'borderVertical', 'borderHorizontal', 
 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderTopWidth', 
 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderWidth', 
 'borderRadius', 'center', 'centerX', 'centerY', 'background', 'backgroundColor',
 'classes', 'addClass', 'removeClass', 'html', 'appendTo', 'removeFrom', 
 'prependTo', 'prepend', 'has', 'tag', 'matches', 'src', 'float', 'off',
 'visibility', 'layer', 'rotate', 'x', 'y', 'z', 'transform', 'transition', 
 'tooltip', 'shadow', 'context2d', 'context3d', 'display', 'cursor']
	.toObject(function (key) {
		return Query.invoker(key);
	})
	.enhance(Query);

['closest', 'find', 'next', 'prev', 'siblings']
	.toObject(function (key) {
		return Query.transformer(key);
	})
	.enhance(Query);

Query.implement({

	isQuery: true,

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
	}

});

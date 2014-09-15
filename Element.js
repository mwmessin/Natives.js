
Element.extend({

	event: function (name) {
		return function (delegation, handler) {
			if (arguments.length == 0) { // event()
				this.dispatchEvent(new CustomEvent(name));
			} else if (arguments.length == 1) {
				if (arguments[0] == false) { // event(false)
					this.addEventListener(name, function (event) {
						event.preventDefault();
						event.cancelBubble = true;
					});
				} else { // event(handler)
					handler = arguments[0];
					this.addEventListener(name, handler);
				}
			} else if (arguments.length == 2) { // event(delegation, handler)
				this.addEventListener(name, function (event) {
					if (event.target.matches(delegation)) {
						return handler(event);
					}
				});
			}

			return this;
		}
	},

	detailedEvent: function (name, listener) {
		return function (detail, delegation, handler) {
			var context = {
				detail: detail,
				delegation: delegation,
				handler: handler
			};

			this.listeners = this.listeners || [];

			if (arguments.length == 0) { // event()
				this.dispatchEvent(new CustomEvent(name, {detail: "*"}));
			} else if (arguments.length == 1) {
				if (arguments[0] == false) { // event(false)
					for (var i = 0; i < this.listeners; ++i) {
						this.removeEventListener(name, this.listeners[i]);
					}
				} else if (arguments[0].isFunction) { // event(handler)
					context.handler = arguments[0];
					context.detail = "*";
					var bound = listener.bind(context);
					this.listeners.push(bound);
					this.addEventListener(name, bound);
				} else { // event(detail)
					this.dispatchEvent(new CustomEvent(name, {detail: detail}));
				}
			} else if (arguments.length == 2) { // event(detail, handler)
				context.handler = arguments[1];
				context.delegation = null;
				var bound = listener.bind(context);
				this.listeners.push(bound);
				this.addEventListener(name, bound);
			} else if (arguments.length == 3) { // event(detail, delegation, handler)
				var bound = listener.bind(context);
				this.listeners.push(bound);
				this.addEventListener(name, bound);
			}

			return this;
		}
	},

	mouseListener: function (event) {
		event.click = event.which ? event.which.toClick() : event.detail;
		
		if (! this.delegation || event.target.matches(this.delegation)) {
			if (this.detail == "*" || this.detail == event.click) return this.handler(event);
		}
	},

	keyListener: function (event) {
		event.key = event.which ? event.which.toKey() : event.detail;

		if (! this.delegation || event.target.matches(this.delegation)) {
			if (this.detail == "*" || this.detail == event.key) return this.handler(event);
		}
	},

	attribute: function (key) {
		return function (value) {
			if (value == null) return this.getAttribute(key);
			this.setAttribute(key, value);
			return this;
		}
	},

	style: function (key) {
		return function (value, time) {
			var style = this.style;

			if (value == null) return style[key];
			if (time != null) this.transition(key, time);

			(function () {
				style[key] = value;
			}).defer();

			return this;
		}
	},

	pxStyle: function (key) {
		return function (value, time) {
			var style = this.style;

			if (value == null) return (style[key] || '0px').toInt();

			if (time != null) {
				this.transition(key, time);
				if (this.style[key] == '') style[key] = '0px';
			}

			(function () {
				style[key] = value.isString ? value : value + 'px';
			}).defer();

			return this;
		}
	},

	transformName: 'transform'.prefixStyle()

});

['touchstart', 'touchend', 'touchstart', 'touchend', 'touchcancel', 'touchleave', 
 'touchmove', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 
 'scroll', 'contextmenu', 'ended', 'progress', 'loadeddata', 'error', 'load',
 'loadedmetadata', 'canplay', 'dragenter', 'dragover', 'drop']
	.from({})
	.map(function (value, key) {
		return Element.event(key);
	})
	.enhance(Element);

['mouseup', 'mousedown']
	.from({})
	.map(function (value, key) {
		return Element.detailedEvent(key, Element.mouseListener);
	})
	.enhance(Element);

['keyup', 'keydown', 'keypress']
	.from({})
	.map(function (value, key) {
		return Element.detailedEvent(key, Element.keyListener);
	})
	.enhance(Element);

['top', 'right', 'bottom', 'left', 'marginTop', 'marginRight', 'marginBottom',
 'marginLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth',
 'borderLeftWidth', 'borderWidth', 'borderRadius', 'paddingTop', 'paddingRight',
 'paddingBottom', 'paddingLeft']
	.from({})
	.map(function (value, key) {
		return Element.pxStyle(key.toDashCase());
	})
	.enhance(Element);

['background', 'backgroundColor', 'display', 'visibility', 'borderTop', 'borderRight', 
 'borderBottom', 'borderLeft', 'position', 'float', 'cursor']
	.from({})
	.map(function (value, key) {
		return Element.style(key.toDashCase());
	})
	.enhance(Element);

Element.implement({

	isElement: true,

	prototype: Element.prototype,

	$: function () {
		return new Query(this);
	},

	drag: function (handler) {
		this.mousemove(function (event) {
			if (window.dragging) handler(event);
		});

		return this;
	},

	start: function (handler) {
		return Element.event('play');
	},

	off: function (name, listener) {
		this.removeEventListener(name, listener);
		return this;
	},

	matches: Element.prototype.matches
		|| Element.prototype.matchesSelector
		|| Element.prototype.msMatchesSelector
		|| Element.prototype.mozMatchesSelector
		|| Element.prototype.webkitMatchesSelector,

	siblings: function (selector) {
		var children = $(this.parentElement).children(selector);
		return children.remove(this);
	},

	next: function (selector) {
		var children = $(this.parentElement).children(selector);
		return children.index(children.indexOf(this) + 1);
	},

	prev: function (selector) {
		var children = $(this.parentElement).children(selector);
		return children.index(children.indexOf(this) - 1);
	},

	closest: function (selector) {
		var element = this;

		while (element && element.matches && ! element.matches(selector)) {
			element = element.parentNode;
		}

		return element;
	},

	find: function (selector) {
		var children = this.children, matches = [];

		for (var i = 0, l = children.length; i < l; ++i) {
			var child = children[i];

			if (child.matches(selector)) matches.push(child);
			matches.add(child.find(selector));
		}

		return new Query(matches);
	},

	tag: function () {
		return this.tagName.toLowerCase();
	},

	has: function (object) {
		if (object.isString) {
			return this.matches(object);
		} else if (object.isElement) {
			return this.contains(object)
		}

		return this;
	},

	attr: function (key, value) {
		if (! value) return this.getAttribute(key);
		this.setAttribute(key, value);
		return this;
	},

	prepend: function (object) {
		this.insertBefore(object, this.firstChild);
		return this;
	},

	prependTo: function (parent) {
		return $(parent)[0].prepend(this);
	},

	append: function (object) {
		this.appendChild(object)
		return this;
	},

	appendTo: function (parent) {
		return $(parent)[0].append(this);
	},

	removeFrom: function (parent) {
		return $(parent)[0].remove(this);
	},

	html: function (markup) {
		this.innerHTML = markup;
		return this;
	},

	addClass: function (string) {
		var classes = this.classes();
		if (classes) this.classes(classes.split(' ').append(string).unique().join(' '));
		else this.classes(string);
		return this;
	},

	removeClass: function (string) {
		var classes = this.classes();
		if (classes) this.classes(classes.split(' ').remove(string).join(' '));
		return this;
	},

	classes: Element.attribute('class'),

	tooltip: Element.attribute('title'),

	src: Element.attribute('src'),

	opacity: function (value, time) {
		if (value == null) return (this.style.opacity || '1').toNumber();
		if (time != null) this.transition('opacity', time);
		this.style.opacity = value;
		return this;
	},

	shadow: Element.style('box-shadow'.prefixStyle()),

	transition: function (key, time) {
		var transitions = this.style['transition'].parse(', ', ' ');

		if (time == null) {
			if (transitions[key] == null) return null;
			return transitions[key].toInt();
		}

		transitions[key] = time + 'ms';
		this.style['transition'] = transitions.serialize(', ', ' ');
		return this;
	},

	transform: function (key, value) {
		var transforms = this.style[Element.transformName].callsObject(' ');
		if (arguments.length == 1) return transforms[key];
		transforms[key] = value;
		this.style[Element.transformName] = transforms.callsString(' ');
		return this;
	},

	x: function (value, time) {
		if (value == null) return (this.transform('translateX') || '0').toInt();
		if (time != null) this.transition(Element.transformName, time);
		this.transform('translateX', value + 'px');
		return this;
	},

	y: function (value, time) {
		if (value == null) return (this.transform('translateY') || '0').toInt();
		if (time != null) this.transition(Element.transformName, time);
		this.transform('translateY', value + 'px');
		return this;
	},

	z: function (value, time) {
		if (value == null) return (this.transform('translateZ') || '0').toInt();
		if (time != null) this.transition(Element.transformName, time);
		this.transform('translateZ', value + 'px');
		return this;
	},

	rotate: function (value, time) {
		if (value == null) return (this.transform('rotate') || '0').toInt();
		if (time != null) this.transition(Element.transformName, time);
		this.transform('rotate', value + 'deg');
		return this;
	},

	layer: Element.style('z-index'),

	borderVertical: function (value) {
		if (arguments.length == 0) return this.borderTop();
		this.borderTop(value), this.borderBottom(value);
		return this;
	},

	borderHorizontal: function (value) {
		if (arguments.length == 0) return this.borderLeft();
		this.borderLeft(value), this.borderRight(value);
		return this;
	},

	border: function (value) {
		if (arguments.length == 0) return this.borderTop();
		this.borderTop(value), this.borderRight(value), this.borderBottom(value), this.borderLeft(value);
		return this;
	},

	borderVerticalWidth: function (value) {
		if (arguments.length == 0) return this.borderTopWidth() + this.borderBottomWidth();
		this.borderTopWidth(value), this.borderBottomWidth(value);
		return this;
	},

	borderHorizontalWidth: function (value) {
		if (arguments.length == 0) return this.borderLeftWidth() + this.borderRightWidth();
		this.borderLeftWidth(value), this.borderRightWidth(value);
		return this;
	},

	paddingVertical: function (value) {
		if (arguments.length == 0) return this.paddingTop() + this.paddingBottom();
		this.paddingTop(value), this.paddingBottom(value);
		return this;
	},

	paddingHorizontal: function (value) {
		if (arguments.length == 0) return this.paddingLeft() + this.paddingRight();
		this.paddingLeft(value), this.paddingRight(value);
		return this;
	},

	padding: function (value) {
		if (arguments.length == 0) return this.paddingTop();
		this.paddingTop(value), this.paddingRight(value), this.paddingBottom(value), this.paddingLeft(value);
		return this;
	},

	width: function (value) {
		if (arguments.length == 0) return this.clientWidth - this.paddingHorizontal();
		if (value.isBoolean) return this.clientWidth + this.borderHorizontalWidth();
		this.style['width'] = value.isString ? value : value + 'px';
		return this;
	},

	height: function (value) {
		if (arguments.length == 0) return this.clientHeight - this.paddingVertical();
		if (value.isBoolean) return this.clientHeight + this.borderVerticalWidth();
		this.style['height'] = value.isString ? value : value + 'px';
		return this;
	},

	centerX: function () {
		return this
			.position('absolute')
			.left('50%')
			.marginLeft(-this.width(true) / 2 | 0);
	},

	centerY: function () {
		return this
			.position('absolute')
			.top('50%')
			.marginTop(-this.height(true) / 2 | 0);
	},

	center: function () {
		return this.centerX().centerY();
	},

	context2d: function () {
		return this.getContext('2d');
	},

	context3d: function () {
		return this.getContext('3d');
	}

});

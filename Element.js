
function styleName(base) {
	var style = document.body.style;
	if (style[base] != null) return base;
	if (style['-ms-' + base] != null) return '-ms-' + base;
	if (style['-moz-' + base] != null) return '-moz-' + base;
	if (style['-webkit-' + base] != null) return '-webkit-' + base;
}

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

			if (arguments.length == 0) { // event()
				this.dispatchEvent(new CustomEvent(name, {detail: "*"}));
			} else if (arguments.length == 1) {
				if (arguments[0] == false) { // event(false)
					this.addEventListener(name, function (event) {
						event.preventDefault();
						event.cancelBubble = true;
					});
				} else if (arguments[0].isFunction) { // event(handler)
					context.handler = arguments[0];
					context.detail = "*";
					this.addEventListener(name, listener.bind(context));
				} else { // event(detail)
					this.dispatchEvent(new CustomEvent(name, {detail: detail}));
				}
			} else if (arguments.length == 2) { // event(detail, handler)
				context.handler = arguments[1];
				context.delegation = null;
				this.addEventListener(name, listener.bind(context));
			} else if (arguments.length == 3) { // event(detail, delegation, handler)
				this.addEventListener(name, listener.bind(context));
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
			if (value == null) return this.style[key];
			if (time != null) this.transition(key, time);
			this.style[key] = value;
			return this;
		}
	},

	pxStyle: function (key) {
		return function (value, time) {
			if (value == null) return (this.style[key] || '0').toInt();
			if (time != null) this.transition(key, time);
			this.style[key] = value.isString ? value : value + 'px';
			return this;
		}
	},

	transformName: styleName('transform')

});

Element.implement({

	isElement: true,

	prototype: Element.prototype,

	$: function () {
		return new Query(this);
	},

	touchstart: Element.event('touchstart'),

	touchend: Element.event('touchend'),

	touchcancel: Element.event('touchcancel'),

	touchleave: Element.event('touchleave'),

	touchmove: Element.event('touchmove'),

	mousemove: Element.event('mousemove'),

	mouseover: Element.event('mouseover'),

	mouseout: Element.event('mouseout'),

	mouseenter: Element.event('mouseenter'),

	mouseleave: Element.event('mouseleave'),

	scroll: Element.event('scroll'),

	mouseup: Element.detailedEvent('mouseup', Element.mouseListener),

	mousedown: Element.detailedEvent('mousedown', Element.mouseListener),

	contextmenu: Element.event('contextmenu'),
	
	keyup: Element.detailedEvent('keyup', Element.keyListener),

	keydown: Element.detailedEvent('keydown', Element.keyListener),

	keypress: Element.detailedEvent('keypress', Element.keyListener),

	matches: Element.prototype.matches
		|| Element.prototype.matchesSelector
		|| Element.prototype.msMatchesSelector
		|| Element.prototype.mozMatchesSelector
		|| Element.prototype.webkitMatchesSelector,

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

	html: function (markup) {
		this.innerHTML = markup;
		return this;
	},

	erase: function (object) {
		if (object.isString) {
			var className = object.extract(/\.([_-\w]+)/);
			if (className) this.removeClass(className);

			var attribute = object.extract(/\[([_-\w]+=['"]?[_-\w]+['"]?)\]/);
			if (attribute) {
				var pair = attribute.split('=');
				var key = pair[0];
				var value = pair[1].extract(/['"]?([_-\w]+)['"]?/);
				this.removeAttribute(key);
			}
		} else if (object.isElement) {
			this.removeChild(object)
		}

		return this;
	},

	addClass: function (string) {
		var classes = this.classes();
		if (classes) this.classes(classes.split(' ').pushUnique(string).join(' '));
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

	position: Element.style('position'),

	display: Element.style('display'),

	visibility: Element.style('visibility'),

	opacity: function (value, time) {
		if (value == null) return (this.style.opacity || '1').toNumber();
		if (time != null) this.transition('opacity', time);
		this.style.opacity = value;
		return this;
	},
	
	background: Element.style('background'),

	shadow: Element.style(styleName('box-shadow')),

	transition: function (key, time) {
		var transitions = this.style['transition'].structure(', ', ' ');

		if (time == null) {
			if (transitions[key] == null) return null;
			return transitions[key].toInt();
		}

		transitions[key] = time + 'ms';
		this.style['transition'] = transitions.destructure(', ', ' ');
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

	top: Element.pxStyle('top'),
	
	right: Element.pxStyle('right'),
	
	bottom: Element.pxStyle('bottom'),
	
	left: Element.pxStyle('left'),

	marginTop: Element.pxStyle('margin-top'),

	marginRight: Element.pxStyle('margin-right'),

	marginBottom: Element.pxStyle('margin-bottom'),

	marginLeft: Element.pxStyle('margin-left'),

	borderTop: Element.style('border-top'),

	borderRight: Element.style('border-right'),

	borderBottom: Element.style('border-bottom'),

	borderLeft: Element.style('border-left'),

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

	borderTopWidth: Element.pxStyle('border-top-width'),

	borderRightWidth: Element.pxStyle('border-right-width'),

	borderBottomWidth: Element.pxStyle('border-bottom-width'),

	borderLeftWidth: Element.pxStyle('border-left-width'),

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

	borderWidth: Element.pxStyle('border-width'),

	borderRadius: Element.pxStyle('border-radius'),

	paddingTop: Element.pxStyle('padding-top'),

	paddingRight: Element.pxStyle('padding-right'),

	paddingBottom: Element.pxStyle('padding-bottom'),

	paddingLeft: Element.pxStyle('padding-left'),

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

document.html = document.body.parentNode;


var sqrt = Math.sqrt,
	sin = Math.sin,
	cos = Math.cos,
	tan = Math.tan,
	asin = Math.asin,
	acos = Math.acos,
	atan = Math.atan,
	atan2 = Math.atan2;

Number.extend({

	PI: Math.PI,
	E: Math.E

});

Number.implement({

	isNumber: true,

	pow: function (exponent) {
		return Math.pow(this, exponent);
	},

	root: function (value) {
		return Math.pow(value, 1 / this);
	},

	abs: function () {
		return Math.abs(this);
	},

	ceil: function () {
		return Math.ceil(this);
	},

	floor: function () {
		return Math.floor(this);
	},

	round: function () {
		return Math.round(this);
	},

	min: function (min) {
		return Math.min(this, min);
	},

	max: function (max) {
		return Math.max(this, max);
	},

	clamp: function (min, max) {
		return Math.max(Math.min(this, max), min);
	},

	wrap: function (min, max) {
		return min + ((this - min) % (max - min));
	},

	toClick: function () {
		return ["left", "middle", "right"][this - 1];
	},

	toKey: function () {
		return ({
			192: "`",
			189: "-",
			187: "=",
			91: "meta",
			40: "down",
			39: "right",
			38: "up",
			37: "left",
			32: "space",
			27: "esc",
			20: "capslock",
			18: "option",
			17: "control",
			16: "shift",
			13: "return",
			9: "tab",
			8: "delete"
		})[this] || String.fromCharCode(this).toLowerCase();
	}

});

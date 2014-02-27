
var random = Math.random,
	qrt = Math.sqrt,
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
	},

	pow: Math.pow.methodize(),

	root: function (value) {
		return Math.pow(value, 1 / this);
	},

	abs: Math.abs.methodize(),

	ceil: Math.ceil.methodize(),

	floor: Math.floor.methodize(),

	round: Math.round.methodize(),

	min: Math.min.methodize(),

	max: Math.max.methodize(),

	clamp: function (min, max) {
		return Math.max(Math.min(this, max), min);
	},

	wrap: function (min, max) {
		return min + ((this - min) % (max - min));
	},

	factorial: function () {
		return this > 0 ? this * (this - 1).factorial() : 1;
	},

	choose: function (k) {
		// number of combinations of k objects without repeats
		return this.factorial() / ((this - k).factorial() * k.factorial())
	},

	multiChoose: function (k) {
		// number of combinations of k objects with repeats
		return (this + k - 1).choose(k);
	}

});

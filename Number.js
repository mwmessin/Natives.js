
var e = Math.E,
	pi = Math.PI;

['random', 'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2']
.from(Math)
.into(window);

['pow', 'abs', 'ceil', 'floor', 'round', 'min', 'max']
.from(Math)
.map(function (f) {
	return f.methodize();
})
.into(Number.prototype);

function gcd(a, b) {
	if (! b) return a;
	return gcd(b, a % b);
}

function fibonacci(n) {
	var sqrt5 = sqrt(5);
	return ((1 + sqrt5).pow(n) - (1 - sqrt5).pow(n)) / ((2).pow(n) * sqrt5);
}

function prime(n) {
	if (n < 1) return;
	if (n = 1) return 2;
	// now what?
}

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

	stop: function () {
		return clearTimeout(this);
	},

	root: function (value) {
		return Math.pow(value, 1 / this);
	},

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
	},

	powmod: function (x, n) {
		// modular exponentiation
		var a = this, r = 1;
		while (x > 0) {
			if (x % 2 == 1) r = (r * a) % n;
			x /= 2;
			a = (a * a) % n;
		}
		return r;
	}

});

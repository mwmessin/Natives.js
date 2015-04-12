
['E', 'PI', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT1_2', 'SQRT2']
	.from(Math)
	.mapKeys(function (key) {
		return key.toLowerCase();
	})
	.into(window);

['random', 'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2']
	.from(Math)
	.into(window);

['pow', 'abs', 'ceil', 'floor', 'round', 'min', 'max']
	.from(Math)
	.map(function (value) {
		return value.methodize();
	})
	.enhance(Number);

function now() {
	return +new Date;
}

function gcd(a, b) {
	if (! b) return a;
	return gcd(b, a % b);
}

function fibonacci(n) {
	var sqrt5 = sqrt(5);
	return ((1 + sqrt5).pow(n) - (1 - sqrt5).pow(n)) / ((2).pow(n) * sqrt5);
}

function prime(n) {
	// sieve of eratosthenes
  var composites = [], primes = [];

  for (var q = 2; q < n; ++q) {
    if (composites[q]) {
      for (var i = 0, p; i < composites[q].length; ++i) {
        p = composites[q][i];

        if (composites[p + q]) {
          composites[p + q].push(p);
        } else {
          composites[p + q] = [p];
        }
      }

      delete composites[q];
    } else {
      primes.push(q);

      if (q * q < n) {
        composites[q * q] = [q];
      }
    }
  }

  return primes[n];
}

Number.implement({

	isNumber: true,

	isPrime: function () {
		var n = this.valueOf();

		if (n <= 3) return n > 1;
		if (n % 2 === 0 || n % 3 === 0) return false;

		var sqrt = Math.floor(Math.sqrt(n));

		for (var i = 5; i <= sqrt; i += 6) {
			if (n % i == 0 || n % (i + 2) == 0) return false;
		}

		return true;
	},

	toClick: function () {
		return ["left", "middle", "right"][this - 1];
	},

	toHex: function () {
		return this.toString(16);
	},

	toKey: function () {
		return ({
			192: "`", 189: "-", 187: "=", 91: "meta", 40: "down", 39: "right", 38: "up", 
			37: "left", 32: "space", 27: "esc", 20: "capslock", 18: "option",
			17: "control", 16: "shift", 13: "return", 9: "tab", 8: "delete"
		})[this] || String.fromCharCode(this).toLowerCase();
	},

	stop: clearTimeout.methodize(),

	root: function (value) {
		return value.pow(1 / this);
	},

	between: function (min, max) {
		return min < this && this < max;
	},

	clamp: function (min, max) {
		return this.min(max).max(min);
	},

	mod: function (n) {
		return (this % n + n) % n;
	},

	wrap: function (min, max) {
		return min + ((this - min).mod(max - min));
	},

	factorial: function () {
		return this > 0 ? this * (this - 1).factorial() : 1;
	},

	factors: function () {
		var factors = [], n = this.valueOf();

		for (var i = 0; i <= n / 2; ++i) {
			if (n % i == 0) factors.push(i);
		}

		return factors;
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

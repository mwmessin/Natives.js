
function log() {
	console.log.apply(console, arguments);
}

function resize(handler) {
	window.addEventListener('resize', handler);
}

resize(function (event) {
	window.width = innerWidth;
	window.height = innerHeight;
});

window.width = innerWidth;
window.height = innerHeight;

query = location.toString().split('?')[1];
params = query ? query.delimObject('&', '=') : null;

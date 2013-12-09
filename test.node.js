
var http = require("http");

http
.createServer(serve)
.listen(1337);

function serve(request, response) {
	console.log(request.url);

	var status = 200, text = 'MWM';

	if (request.url.indexOf('404') !== -1) {
		status = 404;
		text = '404';
		console.log('404!');
	}

	response.writeHead(status, {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain"
	});

	response.write(text);
	response.end();
}

console.log('@http://localhost:1337/');

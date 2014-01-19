// Load the http module to create an http server.
var http = require('http');
var net = require('net');

var devices = new Array();

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	console.log("Connection!");
	request.on('data', function(data) {
		var thing = JSON.parse(data);
		console.log(thing);
		var dev;
		if (thing.action == 'register')
		{
			dev = new Object();
			dev['id'] = devices.length.toString();
			devices.push(dev);
			dev['host'] = thing.host;
			dev['port'] = thing.port;
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end(dev['id']+"\n");
		}
		else if (thing.action == 'update')
		{
			dev = devices[thing.id];
			dev['host'] = thing.host;
			dev['port'] = thing.port;
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end(dev['id']+"\n");
		}
		else if (thing.action == 'send')
		{
			dev = devices[thing.id];
			var options = {
				writable: true,
				readable: true
			};
			var sock = new net.Socket(options);
			console.log(dev['port']);
			console.log(dev['host']);
			var socket = net.connect({port: dev['port'], host: dev['host']},
				function() {
  					socket.write(thing.message+"\n");
				});
			socket.on('data', function(data) {
				console.log(data);
				socket.end();
				
			});
			socket.on('error', function (err) {
			  console.log('sock error', err);
			});
      response.writeHead(200, {"Content-Type": "text/plain"});
			response.end(dev['id']);
		}
	});
	request.on('error', function (err) {
	  console.log('http error', err);
	});
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000, '192.168.1.67');
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running...");

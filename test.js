// Load the net module to create a tcp server.
var net = require('net');

// Setup a tcp server
var server = net.createServer(function (c) {

	c.on('data', function(data) {
		console.log(data.toString());
		c.write('200');
	});
	c.pipe(c);

});

// Fire up the server bound to port 7000 on localhost
server.listen(7000, "localhost");

// Put a friendly message on the terminal
console.log("TCP server listening on port 7000 at localhost.");
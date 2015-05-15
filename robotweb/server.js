// Base code from http://blog.derivatived.com/posts/Control-Your-Robot-With-Node.js-Raspberry-PI-and-Arduino/
// Modified by Ryker Dial May 2015

// Initialize express and server
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
server.listen(80);


// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use(express.static(__dirname + '/public'));

// Set index.html as the base file
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

////////////////////////////////////////////////////////////////////////////////////////////////////
var five = require("johnny-five")
// Initialize connection to Arduino (will crash if none is attached)
board = new five.Board();
	
// When the connection is ready...
board.on("ready", function() {

    // Pin 13 has an LED connected on most Arduino boards.
	// give it a name:
	var red_led = new five.Led({
			pin: 7
	});
	var blue_led = new five.Led({
			pin: 5
	});
	var green_led = new five.Led({
			pin: 6
	});
	// When someone has connected to me...
	io.sockets.on('connection', function (socket) {
	  // Send out a message (only to the one who connected)
	  socket.emit('robot connected', { data: 'Connected' });

	  // When I've received 'robot command' message from this connection...
	  socket.on('robot command', function (data) {
	    console.log(data);
	    var command = data.command;
	    if (command == 'red') {
	    	red_led.on();
	    	blue_led.off();
	    	green_led.off();
	    }
	    else if (command == 'blue') {
	    	red_led.off();
	    	blue_led.on();
	    	green_led.off();
	    }
	    else if (command == 'green') {
	    	red_led.off();
	    	blue_led.off();
	    	green_led.on();
	    }
	    else if (command == 'yellow') {
	    	red_led.on();
	    	blue_led.off();
	    	green_led.on();
	    }
	    else if (command == 'cyan') {
	    	red_led.off();
	    	blue_led.on();
	    	green_led.on();
	    }
	    else if (command == 'purple') {
	    	red_led.on();
	    	blue_led.on();
	    	green_led.off();
	    }
	    else if (command == 'white') {
	    	red_led.on();
	    	blue_led.on();
	    	green_led.on();
	    }
	    else if (command == 'off') {
	    	red_led.off();
	    	blue_led.off();
	    	green_led.off();
	    }

	  });
	});
});
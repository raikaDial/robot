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

var serialport = require('serialport'),// include the library
   SerialPort = serialport.SerialPort, // make a local instance of it
   // get port name from the command line:
   portName = '/dev/ttyACM0';

var myPort = new SerialPort(portName, {
   baudRate: 9600
   // look for return and newline at the end of each data packet:
   //parser: serialport.parsers.readline("\r\n")
 });

console.log( 'Arduino connected on port: ' + portName );

	// When someone has connected to me...
	io.sockets.on('connection', function (socket) {
	  // Send out a message (only to the one who connected)
	  socket.emit('robot connected', { data: 'Connected' });

	  // When I've received 'robot command' message from this connection...
	  socket.on('robot command', function (data) {
	    console.log(data);
	    var command = data.command;
	    if (command == 'red') {
	    	myPort.write('lr');
	    }
	    else if (command == 'blue') {
	    	myPort.write('lb');
	    }
	    else if (command == 'green') {
	    	myPort.write('lg');
	    }
	    else if (command == 'yellow') {
	    	myPort.write('ly');
	    }
	    else if (command == 'cyan') {
	    	myPort.write('lc');
	    }
	    else if (command == 'purple') {
	    	myPort.write('lp');
	    }
	    else if (command == 'white') {
	    	myPort.write('lw');
	    }
	    else if (command == 'off') {
	    	myPort.write('lo');
	    }
	    else if (command == 'forward') {
	    	myPort.write('rf');
	    }
	    else if(command == 'left'){
	    	myPort.write('rl');
	    }
	    else if(command == 'center'){
	    	myPort.write('rc');
	    }
	    else if(command == 'right'){
	    	myPort.write('rr');
	    }
	    else if(command == 'backward'){
	    	myPort.write('rb');
	    }
	    else if (command == 'stop') {
	    	myPort.write('rs');
	    }

	  });
	});
/*////////////////////////////////////////////////////////////////////////////////////////////////////
var five = require("johnny-five");
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

	var motor_front = new five.Servo({
			pin: 8,
			startAt: 90
	});
	var motor_rear = new five.Servo({
			pin: 9,
			startAt: 90
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


	    else if (command == 'forward') {
	    	motor_rear.to(95);
	    }
	    else if(command == 'left'){
	    	motor_front.to(120);
	    }
	    else if(command == 'center'){
	    	motor_front.to(90);
	    }
	    else if(command == 'right'){
	    	motor_front.to(60);
	    }
	    else if(command == 'backward'){
	    	motor_rear.to(85);
	    }
	    else if (command == 'stop') {
	    	motor_front.to(90);
	    	motor_rear.to(90);
	    }


	  });
	});
});*/
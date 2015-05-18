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
   SerialPort = serialport.SerialPort,//, // make a local instance of it
   // get port name from the command line:
   portName = process.argv[2];

var sp = new SerialPort(portName, {
   baudRate: 9600
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

	    // Packet provides uniform format for sending commands to arduino
	    // 4-byte packets, MSB is control code, other 3 bytes are value
	    var PACKET_SIZE = 4;
	    var packet = new Uint8Array( PACKET_SIZE );

	    // Sends commands to arduino over serial connection
	    // Uses two byte code
	    switch( command ) {

		    // Robot commands (prefixed with 'r')
		    case 'forward':
		    	packet[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packet[1] = 102; // f in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
		   		break;
		    case 'left':
		    	packet[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packet[1] = 108; // l in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
		   		break;
		    case 'center':
		    	packet[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packet[1] = 99; // c in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
				break;
		    case 'right':
		    	packetk[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packetk[1] = 114; // r in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
		    	break;
		    case 'backward':
		    	packet[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packet[1] = 98; // b in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
				break;
		    case 'stop':
		    	packet[0] = 114; // Byte code for robot control ( 'r' in ASCII )
		    	packet[1] = 115; // s in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
				break;

			case 'LED':
				packet[0] = 108;  // Byte code for LED control ( 'l' in ASCII )
				packet[1] = data.red;
				packet[2] = data.green;
				packet[3] = data.blue;
			break;
	    	/*// LED commands (prefixed with 'l')
	    	case 'red':
	    		//myPort.write('lr');
	    		break;
		    case 'blue':
		    	//myPort.write('lb');
		    	break;
		    case 'green':
		    	//myPort.write('lg');
		    	break;
		    case 'yellow':
		    	//myPort.write('ly');
		   		break;
		    case 'cyan':
		    	//myPort.write('lc');
		    	break;
		    case 'purple':
		    	///myPort.write('lp');
		    	break;
		    case 'white':
		    	//myPort.write('lw');
		   		break;
		    case 'off':
		    	//myPort.write('lo');
		    	break;
			*/
	    	// Music commands (prefixed with 'm')
	    	case 'a6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 97; // a in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'b6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 98; // b in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'c6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 99; // c in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'd6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 100; // d in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'e6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 101; // e in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'f6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 102; // f in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;
		    case 'g6':
		    	packet[0] = 109; // Byte code for music control ( 'm' in ASCII )
		    	packet[1] = 103; // g in ASCII
		    	packet[2] = 0;
		    	packet[3] = 0;
	    		break;

		    default:
				for( i = 0; i < PACKET_SIZE; i++ ) {
					packet[i] = 0;
				}
				break;
		}

		/*console.log('Building Packet');
		for( i = 0; i < PACKET_SIZE; i++) {
			packet[0] = packet[0] | (packet_chunk[i] << 8*i);
		}*/
		// Send packet over serial
		console.log('Sending Packet');
		sp.write( packet );
		for( i = 0; i < PACKET_SIZE; i++ ) {
			console.log( packet[i] );
			//sp.write( packet[i] );
		}
		console.log('Packet Sent');
	});
});
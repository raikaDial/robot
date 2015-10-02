$(document).ready(function() {
    // Connect to the node.js server. Gets server's local ip.
    // Using this method robot can only be connected to on
    // local network. 
    var ip = location.host;
    var socket = io.connect(ip); // Connects to server
    // Upon establishing a connection to the socket.io server...
    socket.on('robot connected', function (data) {
        console.log(data);
        // Send out a message to the server
        socket.emit('robot command', { command: 'nothing' });
    });

    // These buttons control the movement of the robot
    $('#robot_forward').mousedown(function () {
        console.log("Button Pressed");
        socket.emit('robot command', { command: 'forward' });
    }).mouseup(function () {
        console.log("Button Released");
        socket.emit('robot command', { command: 'stop' });        
    });
    $('#robot_left').click(function () {
        console.log("Button Clicked");
        socket.emit('robot command', { command: 'left' });
    });
    $('#robot_center').click(function () {
        console.log("Button Clicked");
        socket.emit('robot command', { command: 'center' });
    });
    $('#robot_stop').click(function () {
        console.log("Button Clicked");
        socket.emit('robot command', { command: 'stop' });
    });
    $('#robot_right').click(function () {
        console.log("Button Clicked");
        socket.emit('robot command', { command: 'right' });
    });
    $('#robot_backward').mousedown(function () {
        console.log("Button Pressed");
        socket.emit('robot command', { command: 'backward' });
    }).mouseup(function () {
        socket.emit('robot command', { command: 'stop' });
    });

    //var robot_drive_power;
    $(function() {
        $( "#drive_power_slider" ).slider({
            range: "min",
            value: 10,
            min: 0,
            max: 22,
            slide: function( event, ui ) {
                $( "#drive_power" ).val( ui.value );
            }
        });
        $( "#drive_power" ).val( $( "#drive_power_slider" ).slider( "value" ) );
    });

    $('#set_drive_power').click(function () {
        console.log("Button Clicked");
        var robot_drive_power = $( "#drive_power_slider" ).slider( "value" );

        // For a Sabertooth motor controller using simplified serial,
        // each motor has 7 bits of resolution, giving both its
        // forward and backward movement a range of 63.
        socket.emit('robot command', { 
            command: 'set_power', 
            power: robot_drive_power 
        });
    });


    // Control LED Color
    $(".basic").spectrum({
        color: "#000",
        change: function (color) {
            socket.emit('robot command', { 
                command: 'LED', 
                red: color._r, 
                green: color._g,
                blue: color._b
            });
        }
    });
    $('#off').click(function () {
    	console.log("Button Clicked");
        socket.emit('robot command', { 
            command: 'LED', 
            red: 0, 
            green: 0,
            blue: 0
        });
    });
});

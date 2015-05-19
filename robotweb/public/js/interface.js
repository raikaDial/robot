$(document).ready(function() {
    // Connect to the node.js server. Change the IP address to the actual node server location.
    var socket = io.connect('http://192.168.1.105');
    // When I've received 'robot connected' message from the socket.io server...
    socket.on('robot connected', function (data) {
      console.log(data);
      // Send out a message to the server
      socket.emit('robot command', { command: 'nothing' });
    });

    // Drive Robot
    $('#forward').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'forward' });
    });
    $('#left').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'left' });
    });
    $('#center').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'center' });
    });
    $('#stop').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'stop' });
    });
    $('#right').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'right' });
    });
    $('#backward').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'backward' });
    });
    $('#set_drive_power').click(function() {
      console.log("Button Clicked");
      var robot_drive_power = $('#robot_drive_power').val();
      if( (robot_drive_power <= 64) && (robot_drive_power >= 0) ){
        socket.emit('robot command', { command: 'set_power', power: robot_drive_power })
      }
    });

    // Control LED Color
    $(".basic").spectrum({
    color: "#f00",
      change: function(color) {
          $("#basic-log").text("change called: " + color.toHexString());
          socket.emit('robot command', { 
            command: 'LED', 
            red: color._r, 
            green: color._g,
            blue: color._b
          });
      }
    });
    $('#off').click(function() {
    	console.log("Button Clicked");
          socket.emit('robot command', { 
            command: 'LED', 
            red: 0, 
            green: 0,
            blue: 0
          });
    });

    //Control Music
    /*$('#music_c6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_c6' });
    });
    $('#music_d6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_d6' });
    });
    $('#music_e6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_e6' });
    });
    $('#music_f6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_f6' });
    });
    $('#music_g6').click(function() {
      console.log("Button Clicked");
        socket.emit('robot command', { command: 'music_g6' });
    });
    $('#music_a6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_a6' });
    });
    $('#music_b6').click(function() {
      console.log("Button Clicked");
      socket.emit('robot command', { command: 'music_b6' });
    });*/

  });
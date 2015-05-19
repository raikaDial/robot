# robot
Web controlled robot

Hardware required:
	Raspberry Pi
	Arduino Mega (can use Uno but then software serial is needed)
	Sabertooth motor controller (my setup uses the 2x5)
	Wireless Dongle for raspberry pi
	RC car chassis with two sets of wheels
		(my setup uses rear wheel drive with front wheel steering.
		Tank controls would work better, and the code would require
		only slight modification.)
Optional Hardware:
	Raspberry Pi camera module (for streaming camera)
	1 RGB LED (for a light on the robot)
	
Steps to use:
	1. Install raspbian on raspberry pi
	2. Install Node
	3. Install node packages: express, serialport, socket.io

Video streaming currently uses motion. Install with instructions from http://www.linux-projects.org/modules/sections/index.php?op=viewarticle&artid=16

	To install UV4L open a terminal and type the following commands:

   	 $ curl http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc | sudo apt-key add -

	Add the following line to the file /etc/apt/sources.list :

    	deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ wheezy main

    	$ sudo apt-get update
    	$ sudo apt-get install uv4l uv4l-raspicam

	The last two commands will upgrade UV4L to the most recent version, if it's already installed.

	If you want the driver to be loaded at boot, also install this optional package:

    	$ sudo apt-get install uv4l-raspicam-extras

	Install Motion from the official Raspbian repository:

    	raspberrypi ~ $ sudo apt-get install motion

	To start with Motion, download and try the following configuration file, which you can change later according to your needs:

    		raspberrypi ~ $ wget http://linux-projects.org/downloads/examples/motion.conf 

	Now run the driver in background, for example:

    		raspberrypi ~ $ uv4l --driver raspicam --auto-video_nr
    		[notice] [core] Device detected!
    		[notice] [core] Registering device node /dev/video0

	Finally, run Motion:

    		raspberrypi ~ $ LD_PRELOAD=/usr/lib/uv4l/uv4lext/armv6l/libuv4lext.so motion -c ./motion.conf



Start Robot!:
	1. Start server on raspberry pi:
		sudo node server.js path_to_serial_port (e.g. /dev/ttyACM0)
	2. Start motion service
		LD_PRELOAD=/usr/lib/uv4l/uv4lext/armv6l/libuv4lext.so motion -c ./motion.conf
	3. Open up your web browser and go to the address of your raspberry pi!

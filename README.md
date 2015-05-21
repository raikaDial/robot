# robot
Web controlled robot

### Hardware required:
* Raspberry Pi (I used model B)
* Arduino Mega (software serial needs to be implemented for Uno)
* Sabertooth motor controller (my setup uses the 2x5)
* Wireless Dongle for raspberry pi
* LiPO battery (7.4V or 11.1V will work)
* Portable cell phone battery pack to power raspberry pi and arduino
* RC car chassis with two sets of wheels (my setup uses rear wheel drive with front wheel steering. Differential drive would work better, and the code would require only slight modification.)
* Raspberry Pi camera module
* RGB LED (for a light on the robot)
	
### Software Setup:
1. Install raspbian on raspberry pi. 
    * In raspi-config, expand filesystem, enable raspberry pi camera module, and change the memory split to 256/256.
    * Make sure your installation is up to date:
        `sudo apt-get update`
        `sudo apt-get upgrade`
2. Insert wireless dongle and connect to WIFI network.
    * Use **hostname -I** to figure out the ip address of your raspberry pi and take note of it.
3. Install Node.js. I ran into a number of issues installing node, but the following worked for me:
	   `curl -sLS https://apt.adafruit.com/add | sudo bash`
       `sudo apt-get install node`
4. Clone this repository https://github.com/rykerDial/robot.git, then navigate to the directory *robot/robotweb*
5. Install the node packages express, serialport, and socket.io with npm
       `echo 'export PATH="$PATH:/opt/node/bin"' >> ~/.bashrc`
       `source ~/.bashrc`
       `npm install express serialport socket.io`	
6. Change IP addresses in source code:
    * In robot/robotweb/public/index.html go to line 30 and change the iframe src to *<IP_of_your_RASPI>:8081*.
    * In robot/robotweb/public/js/interface.js go to line 3 and change the ip address to *<IP_of_your_RASPI>*.
7. Upload the firmware on your arduino mega:
    * Go to the directory robot/robotweb/firmware and upload firmware.ino to your arduino mega
8. Install motion and the mmal extension (http://www.instructables.com/id/Raspberry-Pi-as-low-cost-HD-surveillance-camera/step7/Installing-the-motion-detection-software/):
       `sudo apt-get install motion`
       `cd /tmp`
       `sudo apt-get install -y libjpeg62 libjpeg62-dev libavformat53 libavformat-dev libavcodec53 libavcodec-dev libavutil51 libavutil-dev libc6-dev zlib1g-dev libmysqlclient18 libmysqlclient-dev libpq5 libpq-dev`
       `wget https://www.dropbox.com/s/xdfcxm5hu71s97d/motion-mmal.tar.gz`  
       `tar zxvf motion-mmal.tar.gz`
       `sudo mv motion /usr/bin/motion`
       `sudo mv motion-mmalcam.conf /etc/motion.conf`
*   Configure motion with
        `sudo nano /etc/motion.conf`
    *   The following setting are suggested:
        * Change location of logfile
              `logfile /tmp/motion.log`
        * Use a low image width and height to improve performance
              `width 320`
              `height 240`
        * Use a decent framerate:
              `framerate 15`
        * Turn off unneeded outputs to increase performance:
              `output_pictures off`
              `output_debug_pictures off`
              `ffmpeg_output_movies off`
              `ffmpeg_output_debug_movies off`
        * Lower image quality to improve performance
              `quality 25`
        * Change stream settings
              `stream_port 8081`
              `stream_quality 25`
              `stream_maxrate 15`
              `stream_localhost off`

### Hardware Setup:
1. Plug in RGB LED to Arduino
    * Solder resistors to the cathodes of your RGB LED, then plug in the leads like so:
          Red Lead: Pin 8  Green Lead: Pin 9  Blue Lead: Pin 10  Anode: GND
2. Plug in wifi dongle, arduino mega, camera module, and battery pack into your raspberry pi.
3. Setup Sabertooth:
    * Connect Sabertooth 0V to Arduino GND and Sabertooth S1 to Arduino TX1
    * Connect the steering motor to M1A and M1B and the drive motor to M2A and M2B
    * Configure DIP switches. Using sabertooth DIP switch wizard:
          1: UP  2: DOWN  3: DOWN  4: DOWN  5: UP  6: UP
    * Hook up your LiPO battery to B+ and B-

### Start Robot!
1. Start server on raspberry pi:
       sudo node server.js <path_to_serial_port> (e.g. /dev/ttyACM0)
2. Start motion service
	   sudo /usr/bin/motion -c /etc/motion.conf
3. Open up your web browser and go to the address of your raspberry pi!

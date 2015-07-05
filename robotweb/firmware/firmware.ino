// Sabertooth 2x5 controls the drive motor with one 8 byte character.
// Sending a character between 1 and 127 controls the speed and direction of the motor.
// Backward is 0, Forward is 127, and 64 is Stop
#define BACKWARD 0
#define STOP 64
#define FORWARD 127
#define RANGE 63

// Servo used to steer the vehicle. Center is 90 degrees, full left is 0 degrees,
// full right is 180 degrees
#define LEFT 0
#define CENTER 90
#define RIGHT 180

// LED Pins
#define RED_LED_PIN 8
#define GREEN_LED_PIN 9
#define BLUE_LED_PIN 10

// Steering Servo Pin
#define STEERING_PIN 13

#include <Servo.h>

Servo steering;

// Drive power for robot. Low by default.
int drivePower = 14;

void setup()
{
    // Serial is used for communication between node.js server and arduino
    // Serial1 is used for communication between arduino and sabertooth
    Serial.begin(9600);
    Serial1.begin(9600);
    
    steering.attach( STEERING_PIN );
    steering.write( CENTER );
    pinMode(RED_LED_PIN, OUTPUT);
    pinMode(BLUE_LED_PIN, OUTPUT);
    pinMode(GREEN_LED_PIN, OUTPUT);
}
  
void loop()
{
    // Read in the 4-byte serial packet
    char buff[4];
    if( Serial.available() >= 4 )
    { 
        Serial.readBytes( buff, 4 );
    }
  
  if( buff[0] == 'r'){
    
        drivePower = buff[2];
        
        switch( buff[1] ) {
          case 'f':
            Serial1.write( FORWARD - RANGE + drivePower );
            break;
          case 'l':
            steering.write( LEFT );
            break;
          case 'c':
            steering.write( CENTER );
            break;
          case 'r':
            steering.write( RIGHT );
            break;
          case 'b':
            Serial1.write( BACKWARD + (RANGE + 1) - drivePower );
            break;
          case 's':
            Serial1.write( STOP );
            break;
        }
  }
  else if( buff[0] == 'l' ) {
    analogWrite(RED_LED_PIN, buff[1]);
    analogWrite(GREEN_LED_PIN, buff[2]);
    analogWrite(BLUE_LED_PIN, buff[3]);
  }
}

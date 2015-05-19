// Sabertooth 2x5 controls the two motors with one 8 byte character.
// Sending a character between 1 and 127 controls motor 1.
// Sending a character between 128 and 255 controls 
#define RIGHT 1
#define CENTER 64
#define LEFT 127
#define BACKWARD 128
#define STOP 192
#define FORWARD 255

#define RANGE 63

// LED Pins
#define RED_LED_PIN 8
#define GREEN_LED_PIN 9
#define BLUE_LED_PIN 10

// Drive power for robot. Low by default.
int drivePower = 14;

void setup()
{
    // Serial is used for communication between node.js server and arduino
    // Serial1 is used for communication between arduino and sabertooth
    Serial.begin(9600);
    Serial1.begin(9600);

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
            Serial1.write( LEFT );
            break;
          case 'c':
            Serial1.write( CENTER );
            break;
          case 'r':
            Serial1.write( RIGHT );
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

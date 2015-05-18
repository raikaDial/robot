// Various byte codes for Sabertooth 2x5 motor
// controller using simplified serial
#define FORWARD 255
#define BACKWARD 128
#define STOP 192
#define LEFT 127
#define CENTER 64
#define RIGHT 1

#define RANGE 64

// LED Pins
#define RED_LED_PIN 8
#define GREEN_LED_PIN 9
#define BLUE_LED_PIN 10

// Speaker Pin
/*#define SPEAKER_PIN 3
#include "pitches.h"*/

int power = 14;

void setup()
{

  
  Serial.begin(9600);
  Serial1.begin(9600);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
}
  
void loop()
{
  char buff[4];
  if( Serial.available() >= 4 )
  { 
    Serial.readBytes( buff, 4 );
  }
  
  if( buff[0] == 'r'){
    
        power = buff[2];
        
        switch( (char)buff[1] ) {
          case 'f':
            Serial1.write( FORWARD - RANGE + power );
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
            Serial1.write( BACKWARD + RANGE + power );
            break;
          case 's':
            Serial1.write( STOP );
            Serial1.write( CENTER );
            break;
        }
  }
  else if( (char)buff[0] == 'l' ) {
    analogWrite(RED_LED_PIN, buff[1]);
    analogWrite(GREEN_LED_PIN, buff[2]);
    analogWrite(BLUE_LED_PIN, buff[3]);
  }
  /*else if( (char)buff[0] == 'h' ) {
       
    char note = buff[1];
    //tone(SPEAKER_PIN, NOTE_A6, 1000/4);
    if( note == 'a' ) {
      tone(SPEAKER_PIN, NOTE_A6, 1000/4);
    }
    else if( note == 'b' ) {
      tone(SPEAKER_PIN, NOTE_B6, 1000/4);
    }
    else if( note == 'c' ) {
      tone(SPEAKER_PIN, NOTE_C6, 1000/4);
    }
    else if( note == 'd' ) {
      tone(SPEAKER_PIN, NOTE_D6, 1000/4);
    }
    else if( note == 'e' ) {
      tone(SPEAKER_PIN, NOTE_E6, 1000/4);
    }
    else if( note == 'f' ) {
      tone(SPEAKER_PIN, NOTE_F6, 1000/4);
    }
    else if( note == 'g' ) {
      tone(SPEAKER_PIN, NOTE_G6, 1000/4);
    }
        switch( buff[1] ) {
          case 'a':
            tone(SPEAKER_PIN, NOTE_A6, 1000/4);
            break;
          case 'b':
            tone(SPEAKER_PIN, NOTE_B6, 1000/4);
            break;
          case 'c':
            tone(SPEAKER_PIN, NOTE_C6, 1000/4);
            break;
          case 'd':
            tone(SPEAKER_PIN, NOTE_D6, 1000/4);
            break;
          case 'e':
            tone(SPEAKER_PIN, NOTE_E6, 1000/4);
            break;
          case 'f':
            tone(SPEAKER_PIN, NOTE_F6, 1000/4);
            break;
          case 'g':
            tone(SPEAKER_PIN, NOTE_G6, 1000/4);
            break;
        }
    }*/

}

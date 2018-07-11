# Simple test to detect if button press is working on pin 17
import RPi.GPIO as gpio
gpio.setmode(gpio.BCM)
gpio.setup(17, gpio.IN)

while True:
    input_value = gpio.input(17)
    if input_value == False:
        print('The button has been pressed...')
        while input_value == False:
            input_value = gpio.input(17)
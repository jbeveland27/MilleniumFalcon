/**
 * Usage:
 * node falcon.js --mode cli|gpio
 * Allows for starting in cli or gpio mode. Gpio mode currently defaults to pin 17.
 * 
 * Disclaimer: I'm not much of a Node dev, so there's probably some egregious stuff
 * happening here. Someday I'll learn more and come back and cleanup. But hey, I was
 * under a deadline and it worked. *shrug*
 */


const cmd = "hello_video.bin --loop media/mfSpace.h264";
const hello_video = "hello_video.bin";
const spawn  = require("child_process").spawn;

// Start Space Loop
let helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]);
helloVidProc.on("close", (code, signal) => {
    console.log(`Child proc terminated due to receipt of signal ${signal}`);    
});

// Start Ambient Sound
var ambientSoundProc = spawn("mpg123", ["--loop", "-1", "media/MF Ambient Sound.mp3"]);
ambientSoundProc.on("close", (code, signal) => {
    console.log(`Ambient Sound Proc terminated due to receipt of code: ${code} | signal: ${signal}`);
});

// omxplayer instance -- can only have 1 of these. Adding more than
// 1 instance led to strange behavior on the pi when calling functions
// (i.e. You do not have true independent control of each instance with omxplayer-controll module!)
var omxp1 = require('omxplayer-controll');
var opts1 = {
    'audioOutput': 'local', //  'hdmi' | 'local' | 'both'
    'blackBackground': false, //false | true | default: true
    'closeOtherPlayers': false, 
    'disableKeys': true, //false | true | default: false
    'disableOnScreenDisplay': true, //false | true | default: false
    'disableGhostbox': true, //false | true | default: false
    'maxPlayerAllowCount': 100,
    'subtitlePath': '', //default: ""
    'startAt': 0, //default: 0
    'startVolume': 0.6, //0.0 ... 1.0 default: 1.0
    'layer': 100 //selects video render layer 2, which is.. beneath layer 3.
};

// Only register this once! 
// Starts the background looping video again as the hyperspeed
// video finishes
omxp1.on("aboutToFinish", () => {
    console.log("About to finish");
    helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]); 
    setTimeout(fadeOut, 500);
});
    
// open GPIO reader and wait for input...

// Command line switch - defaults to cli mode
// This is where the main interactive modes are instantiated
let argv = require('minimist')(process.argv.slice(2));
console.log(argv);
if (argv.mode == "gpio") {
    startGpioMode();
} else {
    startCliMode();
}

// cli mode
function startCliMode() {
    console.log("Starting Cli Mode");
    const readLine = require("./cli");
    readLine.recursiveAsyncReadLine(playVideo, running);
}

// Only want video to play one at a time, so this global running state will help with that.
// Without this all hell breaks loose and things crash!
var running = false;

// GPIO mode
function startGpioMode() {
    console.log("Starting GPIO Mode");
    const Gpio = require('onoff').Gpio;
    const button = new Gpio(17, 'in', 'both', {debounceTimeout: 20});
    
    button.watch(function (err, value) {
        if (err) {
            throw err;
        }
        console.log("Switch off/on:" + value);
        if (!running) {
            running = true;
            playVideo("h");
        } else {
            console.log("Cannot start playback yet - video still running.");
        }
    });

    process.on('SIGINT', function () {
        button.unexport();
    });
}

// Engages Hyperdrive video playback
function playVideo(selection) {
    
    if (selection === "h") {
        
        console.log("Opening video");
        omxp1.open('./media/MF Hyperdrive Activate.mp4', opts1);
        setTimeout(fadeIn, 1000);
        console.log("Starting fade timer");
        
        // Wait a bit for hyperspeed to kick in, then kill the looping video that's in the background
        sleep(3500).then(() => {
            helloVidProc.kill();
        });
    }
}

// Handy little function to allow for time to pass
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


var fadeSpeed = 3;
var alpha = 0;

// fade in using alpha value of 3 every frame (nextTick)
function fadeIn() {
    fadeSpeed = 3;
	if(alpha < 256){
	    omxp1.setAlpha(alpha, function(err){
            if (err) { 
                console.log("fadeIn error: " + err); 
            }
        });
		alpha += fadeSpeed;
		process.nextTick(fadeIn);
	} else {
        console.log("Stopping fade in");
        return;
    }
}

// fade out using alpha value of 15 every frame (nextTick)
function fadeOut() {
    fadeSpeed = 15;
    if (alpha > 255) {
        alpha = 255;
        console.log("Alpha reset to 255");
    }
	if(alpha > 0){
        omxp1.setAlpha(alpha, function(err){
            if (err) {
                console.log("fadeOut error: " + err); 
            }
        });
		alpha -= fadeSpeed;
		process.nextTick(fadeOut);
	} else {
        omxp1.setAlpha(0, function(err){console.log(err)});
        console.log("Stopping fade out");
        sleep(6000).then(() => {running = false;});
        return;
    }
}

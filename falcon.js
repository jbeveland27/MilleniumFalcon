
/*
crossfade-videos.js by github.com/sport4minus
test based on omxplayer-controll example by github.com/winstonwp

– crossfade two videos on raspberry pi using node.js, omxplayer-controll https://github.com/winstonwp/omxplayer-controll and omxplayer.

– working based on omxplayer's capability to set a video render layer.

– two instances of omxplayer are started on different layers, the upper ones' alpha is changed during runtime.

- this example uses two hypothetical videos named movie.mov and other_movie.mov which are in the same directory as the .js file

- tested on raspberry pi 3

*/


const cmd = "hello_video.bin --loop media/mfSpace.h264";
const hello_video = "hello_video.bin";
// const exec  = require("child_process").exec;
// var childProcess = exec(cmd, (error, stdout, stderr) => {
//     if (error) {
//         console.log("exec error: ", error);
//         return;
//     }
//     console.log(`stdout: ${stdout}`, stdout);
//     console.log(`stdout: ${stderr}`, stderr);

// });
// childProcess.kill('SIGINT');

const spawn  = require("child_process").spawn;

// Start Space Loop
let helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]);
helloVidProc.on("close", (code, signal) => {
    console.log(`Child proc terminated due to receipt of signal ${signal}`);    
});

// Start ambient Sound
var ambientSoundProc = spawn("mpg123", ["--loop", "-1", "media/MF Ambient Sound.mp3"]);
ambientSoundProc.on("close", (code, signal) => {
    console.log(`Ambient Sound Proc terminated due to receipt of code: ${code} | signal: ${signal}`);
});


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
    'startVolume': 0.8, //0.0 ... 1.0 default: 1.0
    'layer': 100 //selects video render layer 2, which is.. beneath layer 3.
};

// Only register this once!
omxp1.on("aboutToFinish", () => {
    console.log("About to finish");
    sleep(1000).then(() => { 
        helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]); 
        setTimeout(fadeOut, 500);
    });
});
    
// console.log("Object properties: " + Object.getOwnPropertyNames(omxp1));
// open GPIO reader and wait for input...

// Command line switch - default to cli mode
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
    readLine.recursiveAsyncReadLine(playVideo);
}

// GPIO mode
function startGpioMode() {
    console.log("Starting GPIO Mode");
    //TODO...figure dis out
}

function playVideo(selection) {
    
    if (selection == "h") {
        // Hyperdrive
        console.log("Opening video");
        omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);
        omxp1.getPosition((error, position) => {
            console.log("Position: " + position);
        });
        setTimeout(fadeIn, 1000);
        console.log("Starting fade timer");
        
        sleep(3500).then(() => {
            helloVidProc.kill();
        });
    }
}

// sleep(5000).then(() => {
//     // //background movie
    
    
//     console.log("Opening video");
//     omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);
//     omxp1.getPosition((error, position) => {
//         console.log("Position: " + position);
//     });
//     setTimeout(fadeIn, 1000);
//     console.log("Starting fade timer");




//     // var omxd = require('omxdirector').enableNativeLoop();
//     // omxd.play('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', {audioOutput: 'local'}); // { loop: true, audioOutput: 'local' });
//     // helloVidProc.kill("SIGINT");
//     sleep(3500).then(() => {
//         helloVidProc.kill();
//     });

//     omxp1.on("aboutToFinish", () => {
//         console.log("About to finish");
//         sleep(1000).then(() => { 
//             helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]); 
//             setTimeout(fadeOut, 500);
//         });
//     });
// });

// sleep(50000).then(() => {
//     console.log("Opening video");
//     omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);
//     omxp1.getPosition((error, position) => {
//         console.log("Position: " + position);
//     });
//     setTimeout(fadeIn, 1000);
//     console.log("Starting fade timer");




//     // var omxd = require('omxdirector').enableNativeLoop();
//     // omxd.play('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', {audioOutput: 'local'}); // { loop: true, audioOutput: 'local' });
//     // helloVidProc.kill("SIGINT");
//     sleep(6000).then(() => {
//         helloVidProc.kill();
//     });

//     // DON'T REGISTER 2 EVENT HANDLERS!
//     // omxp1.on("aboutToFinish", () => {
//     //     console.log("About to finish");
//     //     sleep(1000).then(() => { 
//     //         helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]); 
//     //         setTimeout(fadeOut, 1000);
//     //     });
//     // });
// });

// function startSpaceLoop(helloVidProc, callback) {
//     helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]);
// }

// function handleVidProcClose(helloVidProc) {
//     helloVidProc.on("close", (code, signal) => {
//         console.log(`Child proc terminated due to receipt of signal ${signal}`);    
//     });
// }

// function loopAmbientNoise(spawn) {
//     var ambientSoundProc = spawn("mpg123", ["--loop", "-1", "media/MF Ambient Sound.mp3"]);
//     ambientSoundProc.on("close", (code, signal) => {
//         console.log(`Ambient Sound Proc terminated due to receipt of code: ${code} | signal: ${signal}`);
//     });
// }

// sleep(1)
// childProcess.kill();
// kill background process

function playHyperspeed(omxp1, opts1) {
    console.log("Opening video");
    omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);
    omxp1.getPosition((error, position) => {
        console.log("Position: " + position);
    });
    setTimeout(fadeIn, 1000);
    console.log("Starting fade timer");
}

function resetSpaceLoop() {
    sleep(1000).then(() => { 
        helloVidProc = spawn(hello_video, ["--loop", "media/mfSpace.h264"]); 
        setTimeout(fadeOut, 1000);
    });
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// foreground movie
// var omxp = require('omxplayer-controll');

// var opts = {
//     'audioOutput': 'local', //  'hdmi' | 'local' | 'both'
//     'blackBackground': false, //false | true | default: true
//     'disableKeys': true, //false | true | default: false
//     'disableOnScreenDisplay': true, //false | true | default: false
//     'disableGhostbox': true, //false | true | default: false
//     'subtitlePath': '', //default: ""
//     'startAt': 0, //default: 0
//     'startVolume': 0.8, //0.0 ... 1.0 default: 1.0
//     'layer': 3 // selects video render layer 3, which is on top of layer 2, naturally
// };
// omxp.open('/home/pi/Desktop/MilleniumFalcon/media/MF Space.mp4', opts);

// omxp.on('aboutToFinish',function(){
//     console.log('File about to finish');
// });

// //background movie
// var omxp1 = require('omxplayer-controll');
// var opts1 = {
//     'audioOutput': 'local', //  'hdmi' | 'local' | 'both'
//     'blackBackground': false, //false | true | default: true
//     'disableKeys': true, //false | true | default: false
//     'disableOnScreenDisplay': true, //false | true | default: false
//     'disableGhostbox': true, //false | true | default: false
//     'subtitlePath': '', //default: ""
//     'startAt': 0, //default: 0
//     'startVolume': 0.8, //0.0 ... 1.0 default: 1.0
//     'layer': 100 //selects video render layer 2, which is.. beneath layer 3.
// };

// omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);

// //crossfade back and forth by alpha value of 5 every frame (nextTick)
var fadeSpeed = 3;
var alpha = 0;
function fadeIn() {
    fadeSpeed = 3;
	if(alpha < 256){
	    omxp1.setAlpha(alpha, function(err){console.log("fadeIn - error: " + err)});
		alpha += fadeSpeed;
		process.nextTick(fadeIn);
	} else {
        console.log("Stopping fade in");
        return;
    }
    // else {
	// 	process.nextTick(fadeOut);
	// }
}

function fadeOut() {
    fadeSpeed = 15;
    if (alpha > 255) {
        alpha = 255;
        console.log("reset alpha");
    }
	if(alpha > 0){
	omxp1.setAlpha(alpha, function(err){console.log("fadeOut - error: " + err)});
		alpha -= fadeSpeed;
		process.nextTick(fadeOut);
	} else {
        omxp1.setAlpha(0, function(err){console.log(err)});
        console.log("Stopping fade out");
        // omxp1.pause();
        // omxp1.setPosition(0, (error) => {
        //     console.log("Error setting position: " + error); 
        // });
        // omxp1.getPosition((error, position) => {
        //     console.log("Position: " + position);
        // });
        // omxp1.getStatus((error, status) => {
        //     console.log("Status: " + status);
        // });
        return;
    }
    //  else {
    //     process.nextTick(fadeIn);
	// }
}

// //fading begins 5 seconds after initializing the script, as omxplayer instances may not be ready yet.
// setTimeout(fadeOut, 5000);


/*
crossfade-videos.js by github.com/sport4minus
test based on omxplayer-controll example by github.com/winstonwp

– crossfade two videos on raspberry pi using node.js, omxplayer-controll https://github.com/winstonwp/omxplayer-controll and omxplayer.

– working based on omxplayer's capability to set a video render layer.

– two instances of omxplayer are started on different layers, the upper ones' alpha is changed during runtime.

- this example uses two hypothetical videos named movie.mov and other_movie.mov which are in the same directory as the .js file

- tested on raspberry pi 3

*/

// foreground movie
var omxp = require('omxplayer-controll');
var alpha = 255;
var opts = {
    'audioOutput': 'local', //  'hdmi' | 'local' | 'both'
    'blackBackground': false, //false | true | default: true
    'disableKeys': true, //false | true | default: false
    'disableOnScreenDisplay': true, //false | true | default: false
    'disableGhostbox': true, //false | true | default: false
    'subtitlePath': '', //default: ""
    'startAt': 0, //default: 0
    'startVolume': 0.8, //0.0 ... 1.0 default: 1.0
    'layer': 3 // selects video render layer 3, which is on top of layer 2, naturally
};
omxp.open('/home/pi/Desktop/MilleniumFalcon/media/MF Space.mp4', opts);

omxp.on('aboutToFinish',function(){
    console.log('File about to finish');
});

//background movie
var omxp1 = require('omxplayer-controll');
var opts1 = {
    'audioOutput': 'local', //  'hdmi' | 'local' | 'both'
    'blackBackground': false, //false | true | default: true
    'disableKeys': true, //false | true | default: false
    'disableOnScreenDisplay': true, //false | true | default: false
    'disableGhostbox': true, //false | true | default: false
    'subtitlePath': '', //default: ""
    'startAt': 0, //default: 0
    'startVolume': 0.8, //0.0 ... 1.0 default: 1.0
    'layer': 2 //selects video render layer 2, which is.. beneath layer 3.
};

omxp1.open('/home/pi/Desktop/MilleniumFalcon/media/MF Hyperdrive Activate.mp4', opts1);

//crossfade back and forth by alpha value of 5 every frame (nextTick)
var fadeSpeed = 5;

function fadeIn() {
	if(alpha < 255){
	omxp.setAlpha(alpha, function(err){console.log(err)});
		alpha += fadeSpeed;
		process.nextTick(fadeIn);
	} else {
		process.nextTick(fadeOut);
	}
}

function fadeOut() {
	if(alpha > 0){
	omxp.setAlpha(alpha, function(err){console.log(err)});
		alpha -= fadeSpeed;
		process.nextTick(fadeOut);
	} else {
        process.nextTick(fadeIn);
	}
}

//fading begins 5 seconds after initializing the script, as omxplayer instances may not be ready yet.
setTimeout(fadeOut, 5000);

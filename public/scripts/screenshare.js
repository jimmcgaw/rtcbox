var testStream = null;
$(function(){
    var hasGetUserMedia = function(){
        return !!(navigator.webkitGetUserMedia);
    };

    var Camera = function(){
        if (hasGetUserMedia()){
            navigator.webkitGetUserMedia(
                { 
                    video: {
                        mandatory: {
                            chromeMediaSource: 'screen',
                            maxWidth: 640,
                            maxHeight: 360
                        }
                    }
                },
                this.loadMediaStream,
                this.onUserMediaFail
            );
        } else {
            alert("navigator.getUserMedia not supported in your browser!");
        }
    };

    Camera.prototype.loadMediaStream = function(stream) {
        console.log('!!');
        var video = document.querySelector("video.local");
        video.src = window.URL.createObjectURL(stream);
        testStream = stream;
    };

    Camera.prototype.onUserMediaFail = function(){
        console.log("denied!");
    };

    var cam  = new Camera();
    console.log('test2');
}());



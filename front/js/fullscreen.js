const body = document.querySelector("body");


function fullScreen(){
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (body.requestFullscreen) {
          body.requestFullscreen();
        } else if (body.msRequestFullscreen) {
          body.msRequestFullscreen();
        } else if (body.mozRequestFullScreen) {
          body.mozRequestFullScreen();
        } else if (body.webkitRequestFullscreen) {
          body.webkitRequestFullscreen(bodyent.ALLOW_KEYBOARD_INPUT);
        }
    } 
    else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
    }
}

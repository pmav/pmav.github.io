/**
 * Box on Over - pmav.eu
 * v1.0.0 - 28/Nov/2006
 */

var posx = 0;
var poxy = 0;

IE_b = document.all ? true : false
if (!IE_b) document.captureEvents(Event.MOUSEMOVE)
document.onmousemove = getMouseXY;

function getMouseXY(e) {
 if (IE_b) {
  posx = event.clientX + document.body.scrollLeft
  posy = event.clientY + document.body.scrollTop
 } else {
  posx = e.pageX
  posy = e.pageY
 }  
}


function over(s) {
 d = document.getElementById(s);
 d.style.left  = (posx+6)+"px";
 d.style.top = (posy+6)+"px";
 d.style.display = "block";
 fadeIn(s);
}

function out(s) {
 fadeOut(s);
}

/**
 * Fade In & Out - pmav.eu
 * v1.3.0-loopzy - 28/Nov/2006
 */


var waitFrame = 60;
var ie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
var lock  = new Array();
var state = new Array();

function status(s) {
 if (lock[s])
  return true;
 else
  return false;
}

function fadeIn(e) {
 state[e] = true;
 fadeInExec(e, 0, false);
}

function fadeOut(e) {
 state[e] = false;
 fadeOutExec(e, 1, false);
}

function fadeInExec(e, j, s) {
 if (!status(e) || s) { // If unlocked or TRUE
  lock[e] = true;
  img = document.getElementById(e);
  if (j != 1.1) {
   if (ie) img.style.filter = "alpha(opacity="+(j*100)+")"; else img.style.opacity = j;
   setTimeout("fadeInExec(\""+e+"\", "+(Math.round((j+0.1)*10)/10)+", true)", waitFrame);
  } else {
   lock[e] = false;
   if (!state[e]) fadeOut(e)
  }
 }
}

function fadeOutExec(e, j, s) {
 if (!status(e) || s) {
  lock[e] = true;
  img = document.getElementById(e);
  if (j != -0.1) {
   if (ie) img.style.filter = "alpha(opacity="+(j*100)+")"; else img.style.opacity = j;
   setTimeout("fadeOutExec(\""+e+"\", "+(Math.round((j-0.1)*10)/10)+", true)", waitFrame);
  } else {
   lock[e] = false;
   if (state[e]) fadeIn(e)
   document.getElementById(e).style.display = "none"; /* Loopzy */
  }
 }
}
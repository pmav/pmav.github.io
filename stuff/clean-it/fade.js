/**
 * Class Fade
 * v1.5.0 - 16/Mai/2007
 */
function Fade(e, pause, minOpacity, maxOpacity) {
 this.e = e; // Target element Id
 this.pause = (pause == null) ? 60 : pause; // Pause between frames (ms)
 this.minOpacity = (minOpacity == null) ? 0.0 : minOpacity;
 this.maxOpacity = (maxOpacity == null) ? 1.0 : maxOpacity;
 this.minOpacityCheck = this.minOpacity - 0.1;
 this.maxOpacityCheck = this.maxOpacity + 0.1;
 this.ie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
 this.click = this.stop = this.exec = false; // Click type / Stop current step? / In execution?
}


/**
 * On Click
 */
Fade.prototype.clickEvent = function() {
 if (this.click = !this.click) if (this.exec) this.stop = true; else this.fadeIn(); else if (this.exec) this.stop = true; else this.fadeOut();
};


/**
 * Launch Fade In
 */
Fade.prototype.fadeIn = function(m) {
 document.getElementById(this.e).style.display = "block";
 this.exec = true;
 this.fadeInExec(m == null ? this.minOpacity : m);
};



/**
 * Launch Fade Out
 */
Fade.prototype.fadeOut = function(m) {
 this.exec = true;
 this.fadeOutExec(m == null ? this.maxOpacity : m);
};


/**
 * fadeInExec(j:int{iterates Fade In}, s:boolean{lock overwrite})
 * Exec Fade In and check next step: Fade Out or keep going
 */
Fade.prototype.fadeInExec = function(j) {
 if (this.stop) {
  this.stop = false;
  this.fadeOut(j);
 } else {
  e = document.getElementById(this.e);
  if (j != this.maxOpacityCheck) {
   if (this.ie) e.style.filter = "alpha(opacity="+(j*100)+")"; else e.style.opacity = j;
   var t; with (t = this) setTimeout(function() { t.fadeInExec((Math.round((j+0.1)*10)/10)); }, this.pause);
  } else {
   this.exec = false;
  }
 }
};


/**
 * fadeOutExec(j:int{iterates Fade Out}, s:boolean{lock overwrite})
 * Exec Fade Out and check next step: Fade In or keep going
 */
Fade.prototype.fadeOutExec = function(j) {
 if (this.stop) {
  this.stop = false; 
  this.fadeIn(j);
 } else {
  e = document.getElementById(this.e);
  if (j != this.minOpacityCheck) {
   if (this.ie) e.style.filter = "alpha(opacity="+(j*100)+")"; else e.style.opacity = j;
   var t; with (t = this) setTimeout(function() { t.fadeOutExec((Math.round((j-0.1)*10)/10)); }, this.pause);
  } else {
   this.exec = false;
   e.style.display = "none";
  }
 }
};

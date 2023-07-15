var posx = posy = 0;
var mousePosition = function() {IE = document.all ? true : false; if (!IE) document.captureEvents(Event.MOUSEMOVE);document.onmousemove = function(e) {if (IE) {posx = event.clientX + document.body.scrollLeft;posy = event.clientY + document.body.scrollTop;} else {posx = e.pageX;posy = e.pageY;}};}();


window.onload = function() { 
 var m1 = new Moving(document.getElementById('m'), document.getElementById('d1'));
 var m2 = new Moving(document.getElementById('n'), document.getElementById('d2'));
};


function Moving(srcEle, dstEle, pauseTime) {
 this.srcEle = srcEle;
 this.dstEle = dstEle;
 this.pauseTime = pauseTime == undefined ? 15 : pauseTime;
 
 this.offsetx = this.offsety = 0;
 this.isMoving = false;
 this.dstCoords = [];
 this.colorTrue = "lightgreen";
 this.colorFalse = "lightpink";
 
 this.dstEle.style.background = this.colorFalse;

 Moving.prototype.start = function () {
  this.isMoving = true;

  temp = this.findPos(this.dstEle);
  this.dstCoords[0] = temp[0]; // dst: top-left-x [-border]
  this.dstCoords[1] = temp[1]; // dst: top-left-t [-border]
  this.dstCoords[2] = temp[0] + this.dstEle.offsetWidth;  // dst: bottom-right-x
  this.dstCoords[3] = temp[1] + this.dstEle.offsetHeight; // dst: bottom-right-y

  temp = this.findPos(this.srcEle);
  this.offsetx = posx - temp[0]; // src: distance from mouse-x to top-left-x (const)
  this.offsety = posy - temp[1]; // src: distance from mouse-y to top-left-y (const)
 
  this.srcEle.style.position = "absolute";
  this.run();
 };
 
 
 Moving.prototype.stop = function() {
  this.isMoving = false;
 };


 Moving.prototype.run = function() {
  var t = this;
  run = function() {
   if (t.isMoving) {
    srcCoords = [];
    srcCoords[0] = posx - t.offsetx; // src: top-left-x 
    srcCoords[1] = posy - t.offsety; // src: top-left-y
    t.srcEle.style.left = srcCoords[0] + "px";
    t.srcEle.style.top = srcCoords[1] + "px";
    if (t.isInside(srcCoords, t.dstCoords))
     t.dstEle.style.background = t.colorTrue;   
    else
     t.dstEle.style.background = t.colorFalse;
    setTimeout("run()", t.pauseTime);
   }
  };
  run();
 };

 
 Moving.prototype.findPos = function(o) {
	 var curleft = curtop = 0;
	 if (o.offsetParent) {
		 curleft = o.offsetLeft;
		 curtop = o.offsetTop;
		 while (o = o.offsetParent) {
			 curleft += o.offsetLeft;
			 curtop += o.offsetTop;
		 }
	 }
	 return [curleft,curtop];
 };
 
 
 Moving.prototype.isInside = function(a, b) {
  if ((a[0] > b[0]) && (a[1] > b[1]) && (a[0] < b[2]) && (a[1] < b[3]))
   return true;
  return false;
 };

 
 Moving.prototype.events = function(t) {
  var t = t;
  t.srcEle.onmousedown = function() { t.start(); };
  t.srcEle.onmouseup = function() { t.stop(); }; 
 } (this);
 
 
};
var images = ["img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg", "img/05.jpg", "img/06.jpg", "img/07.jpg", "img/08.jpg", "img/09.jpg"];
var zIndex = 100;

// Main
window.onload = function() {
 var movers = [];
 var s = "";

 for(var i = 0; i < images.length; i++)
  s += "<div id=\"i"+(i+1)+"\" class=\"i\" style=\"background: url('"+images[i]+"'); top: "+random(10, 300)+"px; left: "+random(500, 800)+"px;\">&nbsp;</div>";

 document.body.innerHTML += s;

 for (i = 0; i < images.length; i++)
  movers[i] = new Moving(document.getElementById("i" + (i+1)), document.getElementById("p" + (i+1)));
}


// Random Value
var random = function(i, j) { return Math.round((Math.random()*(j-i-1))+i); };


// Mouse Position
var posx = posy = 0;
var mousePosition = function() {IE = document.all ? true : false; if (!IE) document.captureEvents(Event.MOUSEMOVE);document.onmousemove = function(e) {if (IE) {posx = event.clientX + document.body.scrollLeft;posy = event.clientY + document.body.scrollTop;} else {posx = e.pageX;posy = e.pageY;}};}();

// Moving Element
function Moving(srcEle, dstEle, pauseTime) {
 this.srcEle = srcEle;
 this.dstEle = dstEle;
 this.pauseTime = pauseTime == undefined ? 15 : pauseTime;
 
 this.offsetx = this.offsety = 0;
 this.isMoving = false;
 this.isInside = false;
 this.dstCoords = [];
 this.colorTrue = "lightgreen";
 this.colorFalse = "lightpink";
 
 this.dstEle.style.background = this.colorFalse;


 Moving.prototype.start = function () {
  this.srcEle.style.zIndex = zIndex;

  zIndex++;
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
  if (this.isInside)
   this.moveToDst();
 };


 Moving.prototype.run = function() {
  var t = this;
  run = function() {
   if (t.isMoving) {
    srcCoords = [];
    srcCoords[0] = posx - t.offsetx; // src: top-left-x && bottom-left-x
    srcCoords[1] = posy - t.offsety; // src: top-left-y && top-right-y
    srcCoords[2] = srcCoords[0] + t.srcEle.offsetWidth; // src: top-right-x && bottom-right-x
    srcCoords[3] = srcCoords[1] + t.srcEle.offsetHeight; // src: bottom-left-y && bottom-right-y
    t.srcEle.style.left = srcCoords[0] + "px";
    t.srcEle.style.top = srcCoords[1] + "px";
    t.isInside = t.inside(srcCoords, t.dstCoords);
    if (t.isInside)
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
 
 
 Moving.prototype.inside = function(a, b) {
  if ((a[0] > b[0]) && (a[1] > b[1]) && (a[0] < b[2]) && (a[1] < b[3])) // Top Left
   return true;
  if ((a[2] > b[0]) && (a[1] > b[1]) && (a[2] < b[2]) && (a[1] < b[3])) // Top Right
   return true;
  if ((a[0] > b[0]) && (a[3] > b[1]) && (a[0] < b[2]) && (a[3] < b[3])) // Bottom Left
   return true;
  if ((a[2] > b[0]) && (a[3] > b[1]) && (a[2] < b[2]) && (a[3] < b[3])) // Bottom Right
   return true;
  return false;
 };


 Moving.prototype.moveToDst = function() {
  this.srcEle.style.top = this.dstCoords[1] + "px";
  this.srcEle.style.left = this.dstCoords[0] + "px";
  this.srcEle.style.zIndex = 0;
 };


 Moving.prototype.events = function(t) {
  var t = t;
  t.srcEle.onmousedown = function() { t.start(); };
  t.srcEle.onmouseup = function() { t.stop(); }; 
 } (this);
 
 
};
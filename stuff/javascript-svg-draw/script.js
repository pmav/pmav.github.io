
var JSPLOT = {
 inputRun  : true,
 points    : new Array(),
 mousedown : false,
 svg       : null,
 
 init : function() {
  this.svg = new Canvas("svg", 800, 400, "#DDDDDD", "#333", 4);
  //svg.drawLine(0+2,300,800-2,300, "#444", 2);
  //svg.drawLine(400,0+2,400,600-2, "#444", 2);
  this.svg.addCanvas(document.getElementById("canvas"));
  
  this.addEvent(document.getElementById("svg"), 'mousemove', this.mouseMove);
  this.addEvent(document.getElementById("svg"), 'mousedown', function() { JSPLOT.points = new Array(); JSPLOT.mousedown = true; });
  this.addEvent(document.getElementById("svg"), 'mouseup', function() { JSPLOT.mousedown = false; JSPLOT.mouseUp(); });
 },
 
 addEvent : function(element, event, handler, capture){
  if (/msie/i.test(navigator.userAgent)) {
   element.attachEvent('on' + event, handler);
  }
  else {
   element.addEventListener(event, handler, capture ? true : false);
  }
 },
 
 mouseMove : function(event) {
  if (JSPLOT.inputRun && JSPLOT.mousedown) {
   
   JSPLOT.inputRun = false;
   setTimeout(function(){ JSPLOT.inputRun = true; }, 1);
   
   var e = JSPLOT.findPos(document.getElementById("canvas"));
   
   if (JSPLOT.points.length == 0) {
    JSPLOT.points[JSPLOT.points.length] = new Array(event.clientX - e[0], event.clientY - e[1]);
   } else {
    JSPLOT.points[0] = JSPLOT.points[1];
    JSPLOT.points[1] = new Array(event.clientX - e[0], event.clientY - e[1]);
    JSPLOT.svg.drawPolyline(JSPLOT.points, "#FF0000", 2);
   }
    
  }
 },
 
 mouseUp : function() {
  document.getElementById("svgsource").innerHTML = document.getElementById("canvas").innerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;<br>");
 },
 
 findPos: function(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
   do {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
   } while (obj = obj.offsetParent);
   return [curleft, curtop];
  }
 }

}


JSPLOT.addEvent(window, 'load', function() { JSPLOT.init(); });


// *************************************************************************************
// Class Canvas

function Canvas(id, canvasWidth, canvasHeight, fillColor, strokeColor, strokeWidth) {
 this.ns = "http://www.w3.org/2000/svg";
 this.xlinkns = "http://www.w3.org/1999/xlink";

 this.canvasWidth = canvasWidth;
 this.canvasHeight = canvasHeight;

 this.svg = document.createElementNS(this.ns, "svg:svg");
 this.svg.setAttribute("id", id);
 this.svg.setAttribute("width", canvasWidth);
 this.svg.setAttribute("height", canvasHeight);
 this.svg.setAttribute("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
 this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", this.xlinkns);
 
 this.drawRect(0, 0, this.canvasWidth, this.canvasHeight, fillColor, strokeColor, strokeWidth);
}


Canvas.prototype.addCanvas = function(element) {
 element.appendChild(this.svg);
}



Canvas.prototype.drawRect = function(x, y, width, height, fillColor, strokeColor, strokeWidth) {
 shape = document.createElementNS(this.ns, "svg:rect");
 shape.setAttribute("x", x);
 shape.setAttribute("y", y);
 shape.setAttribute("width", width);
 shape.setAttribute("height", height);
 shape.setAttribute("fill", fillColor);
 
 if (strokeColor !== undefined)
  shape.setAttribute("stroke", strokeColor);

 if (strokeWidth !== undefined)
  shape.setAttribute("stroke-width", strokeWidth);  
  
 this.svg.appendChild(shape);
}


Canvas.prototype.drawLine = function(xi, yi, xf, yf, strokeColor, strokeWidth) {
 shape = document.createElementNS(this.ns, "svg:line");
 shape.setAttribute("x1", xi);
 shape.setAttribute("y1", yi);
 shape.setAttribute("x2", xf);
 shape.setAttribute("y2", yf);
 shape.setAttribute("stroke", strokeColor);

 if (strokeWidth !== undefined)
  shape.setAttribute("stroke-width", strokeWidth);  
  
 this.svg.appendChild(shape);
}


Canvas.prototype.drawPolyline = function(points, strokeColor, strokeWidth) {
 shape = document.createElementNS(this.ns, "svg:polyline");
 
 path = "";
 for (var p in points)
  path += points[p][0]+","+points[p][1]+" ";
  
 shape.setAttribute("points", path);
 
 shape.setAttribute("fill", "none");
 
 if (strokeColor !== undefined)
  shape.setAttribute("stroke", strokeColor);

 if (strokeWidth !== undefined)
  shape.setAttribute("stroke-width", strokeWidth);
  
 this.svg.appendChild(shape);
}


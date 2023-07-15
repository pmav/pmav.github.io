window.onload = function() {
 addBox();
};

var setBigger = function() {
 setNewSize(getCurrentSize()+1);
 document.getElementById("s").innerHTML = getCurrentSize()+"px";
};

var setSmaller = function() {
 setNewSize(getCurrentSize()-1);
 document.getElementById("s").innerHTML = getCurrentSize()+"px";
};

var resetSize = function() {
 setNewSize(14);
 document.getElementById("s").innerHTML = getCurrentSize()+"px";
};

var getCurrentSize = function() { 
 var d = document.getElementsByTagName("P");
 return parseInt(d[0].style.fontSize.replace("px", ""));
};

var setNewSize = function(s) {
 var d = document.getElementsByTagName("P");
 for (var i = 0; i < d.length; i++) {
  d[i].style.fontSize = s+"px";
  d[i].style.lineHeight = s+4+"px";
 }
};

var addBox = function() {
 setNewSize(14);
 var b = document.body;
 b.innerHTML = b.innerHTML + "<div id=\"box\"><span id=\"s\">"+getCurrentSize()+"px</span> <span id=\"p\">+</span> <span id=\"m\">-</span> <span id=\"r\">r</span></div>";
 document.getElementById("p").addEventListener("click", setBigger, false);
 document.getElementById("m").addEventListener("click", setSmaller, false);
 document.getElementById("r").addEventListener("click", resetSize, false);
}
/**
 * JS Paint (Table based)
 * pmav.eu
 */

var tableRows = 100,
    tableCols = 100,
    actualColor = "#FF0000",
    mouseDown = false,
    colors = ["#00FFFF", "#008000", "#000080", "#C0C0C0", "#000000", "#808080", "#808000", "#008080", "#0000FF", "#00FF00", "#800080", "#FFFFFF", "#FF00FF", "#800000", "#FF0000", "#FFFF00"],
    colorIndex = 0;

window.onload = function() {
 var b = document.body;
 
 // Table
 var s = "<table id=\"board\">";
 for (var i = 0; i < tableRows; i++) {
  s += "<tr>";
  for (var j = 0; j < tableCols; j++)
   s += "<td></td>";
  s += "</td>";
 }
 s += "</table>"

 // Tools
 s += "<div id=\"colors\">";
 for (i = 0; i < colors.length; i++)
  s += "<div class=\"c\">&nbsp;</div>";
 s += "<div class=\"cl\">&nbsp;</div>";
 s += "<span id=\"erase\">erase</span>";

 // DOM Injection & Events
 b.innerHTML = s;

 var f1 = function() { changeColor(this); };
 var f2 = function() { mouseDown = true; changeColor(this); };
 var f3 = function() { mouseDown = false; };

 walkDOM(document.getElementById("board"), function(node) {
  if (node.nodeName == "TD") {
   node.onmouseover = f1;
   node.onmousedown = f2;
   node.onmouseup = f3;
  }
 })
 
 walkDOM(document.getElementById("colors"), function(node) {
  if (node.className == "c") {
   node.style.background = colors[colorIndex];
   node.onclick = function() { setColor(this); };
   colorIndex += 1;
  }
 })
 
 document.getElementById("erase").onclick = function() {
  walkDOM(b, function(node) {
   if (node.nodeName == "TD")
    node.style.background = "#FFFFFF";
  })
 };

};

var walkDOM = function(node, func) {
 func(node);
 node = node.firstChild;
 while (node) {
  walkDOM(node, func);
  node = node.nextSibling;
 }
};

var changeColor = function(t) {
 if (mouseDown)
  t.style.background = actualColor;
};

var setColor = function(t) {
 actualColor = t.style.background;
};

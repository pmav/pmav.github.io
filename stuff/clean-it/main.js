
var colors = new Array("#000000", "#222222", "#444444", "#666666", "#888888", "#AAAAAA", "#CCCCCC", "#DDDDDD", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF");



/** *************************************************************
 * Global
 */
 
var d = "dialog";
var f  = new Fade(d);
var c = new Array();



/** *************************************************************
 * Main
 */
 
function startup() {
 document.body.innerHTML = "<div id=\"title\"></div><div id=\"main\" onclick=\"f.clickEvent();\">&nbsp;</div><div id=\"dialog\"></div>";
 for (i = 0; i < colors.length; i++) c[i] = new Color('c'+i, colors[i]); // Array of Color Box
 document.getElementById(d).style.width = (c.length * 50)+"px"; // Dialog Width
 createBoxColors(); // Set Element Colors
}



/** *************************************************************
 * Init Colors
 */
 
function Color(id, color) { // Class Color Box
 this.id = id;
 this.color = color;
}

function createBoxColors() { // Insert/Change Default CSS
 for (i = 0; i < c.length; i++) {  
  document.getElementById(d).innerHTML += "<div id=\""+c[i].id+"\" class=\"color\" onmouseover=\"changeBackground("+i+")\">&nbsp;</div>";
  document.getElementById(c[i].id).style.background = c[i].color;
 }
}



/** *************************************************************
 * Change Background color
 */

function changeBackground(i) {
 document.body.style.background = c[i].color;
}

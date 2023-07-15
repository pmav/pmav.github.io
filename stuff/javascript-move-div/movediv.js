
var div;
var content;

function show(id) {
 div = document.getElementById(id);
 content = div.innerHTML;
 div.innerHTML = "";
 div.style.display = "block";
 run(0);
}

function hide(id) {
 div = document.getElementById(id);
 div.style.display = "none";
}


function run(i) {
 if (i < 170) {
  div.style.height = (i)+"px";
  div.style.opacity = i/170;
  setTimeout("run("+(i+1)+")", 10);
 } else {
  div.innerHTML = content;
 }
}

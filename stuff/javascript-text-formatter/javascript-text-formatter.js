/**
 * JS Text Formatter (v1.0)
 * http://pmav.eu
 * 
 * v1.0.0 - 29/Jul/2007
 * v1.0.1 - 14/Mar/2008 - New fonts
 */

var ie = navigator.userAgent.match(/MSIE/) ? 1 : 0;

var vtext = "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, `and what is the use of a book,' thought Alice `without pictures or conversation?'<br />So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.<br />There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, `Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT- POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.";
var vfont = "Arial";
var vserif = 0;
var vsize = 16;
var vbold = 0;
var vitalic = 0;
var vsmallcaps = 0;
var vunderline = 0;
var voverline = 0;
var vlinethrough = 0;
var vcase = "none";
var valign = "left";
var vletterspacing = 0;
var vwordspacing = 0;
var vlineheight = 19;
var vtextindent = 0;
var vbackcolor = "";
var vtextcolor = "";

var textOutput;
var codeOutput;

window.onload = function() {
 textOutput = document.getElementById("outputtext");
 codeOutput = document.form2.code;
 document.form1.vsize.value = vsize+"px";
 document.form1.vletterspacing.value = vletterspacing+"px";
 document.form1.vwordspacing.value = vwordspacing+"px";
 document.form1.vlineheight.value = vlineheight+"px";
 document.form1.vtextindent.value = vtextindent+"px";
 document.form1.vtextcolor.value = "#000000";
 document.form1.vbackcolor.value = "#FFFFFF";
 document.form2.text.value = vtext;
 applyNewCSS();
 makeCodeOutput();
};

var makeCodeOutput = function() {
 var code = "";
 code += " font: "+vsize+(vsize == 0 ? "" : "px")+"/"+vlineheight+(vlineheight == 0 ? "" : "px")+" \""+vfont+"\", "+(vserif == 0 ? "sans-serif" : (vserif == 1 ? "serif" : "monospace"))+";\n";
 code += " text-align: "+valign+";\n";
 if (vbold == 1)
  code += " font-weight: bold;\n";
 if (vitalic == 1)
  code += " font-style: italic;\n";
 if (vsmallcaps == 1)
  code += " font-variant: small-caps;\n";
 var s = (vunderline == 1 ? " underline" : "") + (voverline == 1 ? " overline" : "") + (vlinethrough == 1 ? " line-through" : "");
 if (s != "")
  code += " text-decoration: "+s.substr(1, s.length-1)+";\n";
 if (vcase != "none")
  code += " text-transform: "+vcase+";\n";
 if (vletterspacing != 0)
  code += " letter-spacing: "+vletterspacing+"px;\n";
 if (vwordspacing != 0)
  code += " word-spacing: "+vwordspacing+"px;\n";
 if (vtextindent != 0)
  code += " text-indent: "+vtextindent+"px;\n";
 if (vbackcolor != "")
  code += " background: "+vbackcolor+";\n";
 if (vtextcolor != "")
  code += " color: "+vtextcolor+";\n";
 codeOutput.value = "div {\n"+code+"}";
};

var applyNewCSS = function() {
 textOutput.style.fontFamily = vfont;
 textOutput.style.fontSize = vsize+"px";
 textOutput.style.fontWeight = vbold == 1 ? "bold" : "";
 textOutput.style.fontStyle = vitalic == 1 ? "italic" : "";
 textOutput.style.fontVariant = vsmallcaps == 1 ? "small-caps" : "";
 textOutput.style.textDecoration = (vunderline == 1 ? "underline" : "") + (voverline == 1 ? " overline" : "") + (vlinethrough == 1 ? " line-through" : "");
 textOutput.style.textTransform = vcase;
 textOutput.style.textAlign = valign;
 textOutput.style.letterSpacing = vletterspacing+"px";
 textOutput.style.wordSpacing = vwordspacing+"px";
 textOutput.style.lineHeight = vlineheight+"px";
 textOutput.style.textIndent = vtextindent+"px";
 textOutput.style.color = vtextcolor;
 textOutput.style.background = vbackcolor;
 textOutput.innerHTML = vtext;
};

var changeFont = function() {
 switch(parseInt(document.form1.vfont.value)) {
  case 0: vfont = "Arial"; vserif = 0; break;
  case 1: vfont = "Comic Sans MS"; vserif = 0; break;
  case 2: vfont = "Courier"; vserif = 2; break;
  case 3: vfont = "Courier New"; vserif = 2; break;
  case 4: vfont = "Franklin Gothic Medium"; vserif = 0; break;
  case 5: vfont = "Georgia"; vserif = 1; break;
  case 6: vfont = "Impact"; vserif = 0; break;
  case 7: vfont = "Lucida Console"; vserif = 2; break;
  case 8: vfont = "Lucida Sans Unicode"; vserif = 0; break;
  case 9: vfont = "Lucida Sans"; vserif = 0; break;
  case 10: vfont = "Palatino Linotype"; vserif = 1; break;
  case 11: vfont = "Tahoma"; vserif = 0; break;
  case 12: vfont = "Times New Roman"; vserif = 1; break;
  case 13: vfont = "Verdana"; vserif = 0; break;
  default: vfont = "Arial"; vserif = 0;
 }
 applyNewCSS();
 makeCodeOutput();
};

var changeSize = function(n) {
 if (n == 0)
  vsize = (vsize - 1) < 0 ? 0 : vsize - 1;
 else
  vsize += + 1;
 document.form1.vsize.value = vsize+"px";
 applyNewCSS();
 makeCodeOutput();
};

var changeBold = function() {
 vbold = vbold == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeItalic = function() {
 vitalic = vitalic == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeSmallcaps = function() {
 vsmallcaps = vsmallcaps == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeUnderline = function() {
 vunderline = vunderline == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeOverline = function() {
 voverline = voverline == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeLinethrough = function() {
 vlinethrough = vlinethrough == 0 ? 1 : 0;
 applyNewCSS();
 makeCodeOutput();
};

var changeCase = function(n) {
 switch(n) {
  case 0: vcase = "none"; break;  
  case 1: vcase = "lowercase"; break;
  case 2: vcase = "uppercase"; break
  case 3: vcase = "capitalize"; break
  default: vcase = "none";
 }
 applyNewCSS();
 makeCodeOutput();
};

var changeAlign = function(n) {
 switch(n) {
  case 0: valign = "left"; break;
  case 1: valign = "right"; break;
  case 2: valign = "center"; break;
  case 3: valign = "justify"; break;
  default: valign = "left";
 }
 applyNewCSS();
 makeCodeOutput();
};

var changeLetterspacing = function(n) {  
 vletterspacing += n == 0 ? -1 : 1;
 document.form1.vletterspacing.value = vletterspacing+"px";
 applyNewCSS();
 makeCodeOutput();
};

var resetLetterspacing = function() {
 vletterspacing = 0;
 document.form1.vletterspacing.value = vletterspacing+"px";
 applyNewCSS();
 makeCodeOutput();
};

var changeWordspacing = function(n) {  
 vwordspacing += n == 0 ? -1 : 1;
 document.form1.vwordspacing.value = vwordspacing+"px";
 applyNewCSS();
 makeCodeOutput();
};

var resetWordspacing = function() {
 vwordspacing = 0;
 document.form1.vwordspacing.value = vwordspacing+"px";
 applyNewCSS();
 makeCodeOutput();
};

var changeLineheight = function(n) {  
 if (n == 0)
  vlineheight = (vlineheight - 1) < 0 ? 0 : vlineheight - 1;
 else
  vlineheight += 1;
 document.form1.vlineheight.value = vlineheight+"px";
 applyNewCSS();
 makeCodeOutput();
};

var changeTextindent = function(n) {  
 vtextindent += n == 0 ? -1 : 1;
 document.form1.vtextindent.value = vtextindent+"px";
 applyNewCSS();
 makeCodeOutput();
};

var resetTextindent = function() {
 vtextindent = 0;
 document.form1.vtextindent.value = vtextindent+"px";
 applyNewCSS();
 makeCodeOutput();
};

var changeText = function() {
 vtext = document.form2.text.value;
 applyNewCSS();
};

var changeTextcolor = function() {
 vtextcolor = document.form1.vtextcolor.value;
 applyNewCSS();
 makeCodeOutput();
};

var changeBackcolor = function() {
 vbackcolor = document.form1.vbackcolor.value;
 applyNewCSS();
 makeCodeOutput();
};
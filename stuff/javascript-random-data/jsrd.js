/**
 * Javascript Random Data
 * 2008, 2015 http://pmav.eu
 * v1.1
 * 13/Jun/2015 - Password data type added.
 */

var JSRD = {
 debug  : false,
 debugData : {},
 input  : null, // Input Element
 output : null, // Output Element
 
 data        : '',     // Random Data Container
 dataMaxSize : null,   // Data Size: Fill Output Element
 dataType    : null,   // Data Type: Binary(2), Octal(8), Decimal(10), Hexadecimal(16), Alphanumeric(36)
 dataSource  : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@€$£%&()[]{}=?+-*',

 inputState   : false, // Input Element State: On/Off
 inputRun     : true,  // Mouse Move Execute: Yes/No (Delay)
 inputTimeout : 20,    // Inactive Time between Mouse Moves
 
 dataTypeList : [
  {value:  2, name: 'Binary',       checked: 0},
  {value:  8, name: 'Octal',        checked: 0},
  {value: 10, name: 'Decimal',      checked: 0},
  {value: 16, name: 'Hex',          checked: 0},
  {value: 36, name: 'Alphanumeric', checked: 0},
  {value: 80, name: 'Password',     checked: 1} ],

 // ###########################################################################################################################
 // ### onload
 
 start : function(input, output, dataMaxSize) {
  this.injectHTML();

  this.dataMaxSize = dataMaxSize;

  this.input = document.getElementById(input);
  this.output = document.getElementById(output);

  this.setInputState(); // Set Input Active
  this.eventRegister(); // Add Events
 },
 
 // ###########################################################################################################################
 // ### Events
 
 eventRegister : function() {
  this.addEvent(this.input,  'click', this.eventInputClick);   // Stop/Start input on click
  this.addEvent(this.output, 'click', this.eventSelectOutput); // Select output on click
  
  var childNodes = document.getElementById('dataTypeSelect').childNodes;

  for (var i in childNodes) {
   if (childNodes[i].nodeName == 'SPAN') {
    this.addEvent(childNodes[i], 'click', this.eventDataTypeSelect); // Span Click Event
   }
  }
 },
 
 eventInputClick : function() {
  JSRD.setInputState();
 },
 
 eventSelectOutput : function(event) {
  if (event.srcElement) {
   event.srcElement.select();   
  } else {
   this.select(); 
  }
 },
 
 eventMouseMove : function(event) {
  JSRD.mouseMove(event);
 },
 
 eventDataTypeSelect : function (event) {
  var element = null;
  if (event.srcElement) {
   element = event.srcElement;
  } else {
   element = this;
  }
  element.firstChild.checked = true;
  JSRD.dataType = element.firstChild.value;
  JSRD.setDataTypeSelectedStyle();
  JSRD.output.value = JSRD.data = '';
  if (!JSRD.inputState) {
   JSRD.setInputState();
  }
 },
 
 // ###########################################################################################################################
 // ### Main

 setDataTypeSelectedStyle : function() {
  var childNodes = document.getElementById('dataTypeSelect').childNodes;
  for (var i in childNodes) {
   if (childNodes[i].nodeName == 'SPAN') {
    if (childNodes[i].firstChild.checked) {
     childNodes[i].className = 'selected';
    } else {
     childNodes[i].className = '';
    }
   }
  }
 },
 
 setInputState : function() {
  if (this.inputState) {
   this.removeEvent(this.input, 'mousemove', this.eventMouseMove);
   this.inputState = false;
  } else {
   this.addEvent(this.input, 'mousemove', this.eventMouseMove);
   this.inputState = true;
  }
 },
 
 mouseMove : function(event) {
  if (this.inputRun) {
   this.inputRun = false;
   setTimeout(function() { JSRD.inputRun = true; }, JSRD.inputTimeout);
   this.data += this.randomDataCore(event.clientX, event.clientY);
   if (this.data.length == this.dataMaxSize) {
    this.data = this.data.substring(1, this.dataMaxSize);
   }
   this.output.value = this.data;
  }
 },
 
 randomDataCore : function(x, y) {
  var c = this.dataSource.charAt((x*y*this.random(0, 999999) + (new Date().getTime())) % this.dataType);
  if (this.debug)
    this.processDebug(c);
  return c;
 },
 
 injectHTML : function() {
  var html = '';
  for (var i in this.dataTypeList) {
   if (this.dataTypeList[i].checked == 1) {
    this.dataType = this.dataTypeList[i].value;
   }
   html += '<span><input type="radio" name="dataType" value="'+this.dataTypeList[i].value+'" '+(this.dataTypeList[i].checked == 1 ? 'checked="checked"' : '')+'> '+this.dataTypeList[i].name+'</span> ';
  }
  document.getElementById('types').innerHTML += '<div id="dataTypeSelect">'+html+'</div><div class="cl">&nbsp</div>';
  this.setDataTypeSelectedStyle();
 },

 processDebug : function(c) {
  if (this.debugData[c] === undefined)
    this.debugData[c] = 0;
  this.debugData[c]++

  var node = document.getElementById("debug"), out = "", count = 0;
  for (var c in this.debugData)
  {
    out += c + ":<b>"+this.debugData[c]+"</b> ";
    count++;
  }
  node.innerHTML = count + "<br>" + out;
  node.style.display = 'block';
 },

 // ###########################################################################################################################
 // ### Helpers

 addEvent : function (element, event, handler, capture) {
  if (/msie/i.test(navigator.userAgent)) {
   element.attachEvent('on' + event, handler);
  } else {
   element.addEventListener(event, handler, capture ? true : false);
  }
 },
 
 removeEvent : function(element, event, handler, capture) {
  if (/msie/i.test(navigator.userAgent)) {
   element.detachEvent('on' + event, handler);
  } else {
   element.removeEventListener(event, handler, capture ? true : false);
  }
 },

 random : function(i, j) { 
  return Math.round((Math.random()*(j-i))+i);
 }

};

JSRD.addEvent(window, 'load', function() { JSRD.start('input', 'output', 35); });

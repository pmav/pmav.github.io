/**
 * Game of Life - JS & CSS
 * http://pmav.eu
 * 24/Fev/2009
 */

var GOL = {

  // HTML Elements
  table : null,
  generationElement : null,
  steptimeElement : null,

  // World Size & Config
  columns : 90,
  rows : 48,
  waitTime: 10,
  colors : {
    dead : '#FFFFFF',
    visited : '#B5ECA2',
    
    // Blue to Red
    //alive : ['#7584EA', '#8278D5', '#8E6CBF', '#9B60AA', '#A75495', '#B44880', '#C03C6A', '#CD3055', '#D92440', '#E6182B', '#F20C15', '#FF0000', '#F20C15', '#E6182B', '#D92440', '#CD3055', '#C03C6A', '#B44880', '#A75495', '#9B60AA', '#8E6CBF', '#8278D5']

    // Blue
    alive : ['#9898FF', '#8585FF', '#7272FF', '#5F5FFF', '#4C4CFF', '#3939FF', '#2626FF', '#1313FF', '#0000FF','#1313FF' ,'#2626FF' ,'#3939FF' ,'#4C4CFF' ,'#5F5FFF' ,'#7272FF' ,'#8585FF']
  },

  // Arrays
  world : null,
  newWorld : null,
  cells : null,
  age : null,

  avgStepTime : 0,
  validTimeSteps: 0,
  generation : 0,

  mouseDown : false,
  running : false,
  clear : false,


 /** ******************************************************************************************************************
  * On Load Event && Clean-up Event
  */
  init : function(clear) {
    clear = (clear == undefined ? false : clear);

    this.world = this.newWorld = this.cells = this.age = null;
    this.generation = this.avgStepTime = this.validTimeSteps = 0;
    this.mouseDown = this.running = this.clear = false;

    this.table = document.getElementById('world');
    this.generationElement = document.getElementById('generation');
    this.steptimeElement = document.getElementById('steptime');

    this.initWorld();
    if (!clear) {
     this.loadWorldFromURL();
    }
    this.drawWorld();
  },


 /** ******************************************************************************************************************
  * Init World State - Default Grid
  */
  initWorld : function() {
    this.world = [];
    this.newWorld = [];
    this.age = [];
    for (var i = 0; i < this.rows; i++) {
      this.world[i] = [];
      this.newWorld[i] = [];
      this.age[i] = [];
      for (var j = 0; j < this.columns; j++) {
        this.world[i][j] = false;
        this.newWorld[i][j] = false;
        this.age[i][j] = 0;
      }
    }
  },


 /** ******************************************************************************************************************
  * Load world state from URL parameter
  */
  loadWorldFromURL : function() {
    var s = this.getUrlVars()['s'];
    if (s != undefined) {
      try {
        var object = YAHOO.lang.JSON.parse(decodeURI(s));
        for (var i = 0; i < object.state.length; i = i + 4) {
          this.world[parseInt(object.state[i]+''+object.state[i+1], 10)][parseInt(object.state[i+2]+''+object.state[i+3], 10)] = true;
        }
      } catch (e) {
        alert(e);
        return;
      }
    }
  },


 /** ******************************************************************************************************************
  * Init World (HTML Table) - Register Mouse Events
  */
  drawWorld : function() {

    var table = document.createElement('table');
    this.cells = [];

    for (var i = 0; i < this.rows; i++) {
      var line = document.createElement('tr');
      this.cells[i] = [];
      for (var j = 0; j < this.columns; j++) {
        var cell = document.createElement('td');

        // Init dead Cell
        cell.style.backgroundColor = this.colors.dead;

        // Register Event Handlers
        this.addEvent(cell, 'mousedown', function(x, y) {
          return function (event) {
            GOL.cellMouseDownHandler(x, y, event);
          }
        }(i, j));

        this.addEvent(cell, 'mouseup', function() {
          return function () {
            GOL.cellMouseUpHandler();
          }
        }());

        this.addEvent(cell, 'mouseover', function(x, y) {
          return function (event) {
            GOL.cellMouseOverHandler(x, y, event);
          }
        }(i, j));

        line.appendChild(cell); // Add Cell to HTML
        this.cells[i][j] = cell; // Save Cell reference for editon
      }
      table.appendChild(line);
    }
    this.table.appendChild(table);

    // Initial State
    var s = this.getUrlVars()['s'];
    if (s != undefined) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.world[i][j]) {
            this.changeCelltoAlive(i, j);
          }
        }
      }
    }
  },


 /** ******************************************************************************************************************
  * Change Cell State
  */
  changeCellState : function(i, j) {
    this.world[i][j] = !this.world[i][j];
    if (this.world[i][j])
      this.changeCelltoAlive(i, j);
    else
      this.changeCelltoDead(i, j);
  },


 /** ******************************************************************************************************************
  * Change Cell State - to Alive
  */
  changeCelltoAlive : function(i, j) {
    this.age[i][j]++;
    this.cells[i][j].style.backgroundColor = this.colors.alive[this.age[i][j] % this.colors.alive.length];
  },


 /** ******************************************************************************************************************
  * Change Cell State - to Dead
  */
  changeCelltoDead : function(i, j) {
    this.age[i][j] = 0;
    this.cells[i][j].style.backgroundColor = this.colors.visited;
  },


 /** ******************************************************************************************************************
  *  Clear World - Reset Table and States
  */  
  clearWorld : function() {
    this.table.innerHTML = '';
    this.generationElement.innerHTML = '0';
    this.steptimeElement.innerHTML = '';
    this.init(true);
  },


 /** ******************************************************************************************************************
  * Main Core - Run Next Step (Calc step times, define execution flow)
  */
  nextStep : function () {

    var start = (new Date).getMilliseconds();

    // <core ----------------------------------------------- >

    this.newWorld = this.arrayCopy(this.world);

    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.columns; j++) {
        this.checkState(i, j);
      }
    }

    this.world = this.newWorld;

    this.generationElement.innerHTML = this.generation++;

    // < ---------------------------------------------- /core>

    var time = (new Date).getMilliseconds() - start;

    if (time < 0) {
      this.steptimeElement.innerHTML = '?? ('+Math.round(this.avgStepTime)+')';
    } else {
      this.validTimeSteps++;
      var r = 1./this.validTimeSteps;
      this.avgStepTime = (this.avgStepTime * (1-r)) + (time * r);
      this.steptimeElement.innerHTML = time+' ('+Math.round(this.avgStepTime)+')';
    }

    if (this.running) {
      setTimeout(function() { GOL.nextStep(); }, this.waitTime);
    } else {
      if (this.clear) {
        this.clearWorld();
      }
    }
  },


 /** ******************************************************************************************************************
  * Check Cell State - Apply GOL Rules
  */
  checkState : function (i, j) {
    var neighbours = this.getNeighbours(i, j);

    // Rules
    if (this.world[i][j]) { // Populated
      if (neighbours == 0 || neighbours == 1 || neighbours > 3)
        this.newWorld[i][j] = false;
    } else { // Empty
      if (neighbours == 3)
        this.newWorld[i][j] = true;
    }

    // Refresh State
    if (this.newWorld[i][j] != this.world[i][j]) {
      if (this.newWorld[i][j]) {
        this.changeCelltoAlive(i, j);
      } else {
        this.changeCelltoDead(i, j);
      }
    } else if (this.newWorld[i][j]) {
      this.changeCelltoAlive(i, j);
    }
  },


 /** ******************************************************************************************************************
  * Get Neighbours from i,j Cell
  */
  getNeighbours : function(i, j) {
    var neighbours = 0;

    if (this.world[i - 1] != undefined) {
      neighbours +=
      (this.world[i - 1][j - 1] == undefined ? 0 : this.world[i - 1][j - 1] ? 1 : 0) +
      (this.world[i - 1][j] == undefined ? 0 : this.world[i - 1][j] ? 1 : 0) +
      (this.world[i - 1][j + 1] == undefined ? 0 : this.world[i - 1][j + 1] ? 1 : 0);
    }

    neighbours +=
    (this.world[i][j - 1] == undefined ? 0 : this.world[i][j - 1] ? 1 : 0) +
    (this.world[i][j + 1] == undefined ? 0 : this.world[i][j + 1] ? 1 : 0);

    if (this.world[i + 1] != undefined) {
      neighbours +=
      (this.world[i + 1][j - 1] == undefined ? 0 : this.world[i + 1][j - 1] ? 1 : 0) +
      (this.world[i + 1][j] == undefined ? 0 : this.world[i + 1][j] ? 1 : 0) +
      (this.world[i + 1][j + 1] == undefined ? 0 : this.world[i + 1][j + 1] ? 1 : 0);
    }

    return neighbours;
  },

  // Event Handlers

 /** ******************************************************************************************************************
  * Handler - On Mouse Down over Cell
  */
  cellMouseDownHandler : function(i, j, event) {
    this.mouseDown = true;
    this.changeCellState(i, j, event);
  },


 /** ******************************************************************************************************************
  * Handler - On Mouse Up over Cell
  */
  cellMouseUpHandler : function() {
    this.mouseDown = false;
  },


 /** ******************************************************************************************************************
  * Handler - On Mouse Moves Over Cell
  */
  cellMouseOverHandler : function(i, j, event) {
    if (this.mouseDown)
      this.changeCellState(i, j, event);
  },


 /** ******************************************************************************************************************
  * Button Handler - Run
  */
  buttonRun : function(button) {
    this.running = !this.running;
    if (this.running) {
      this.nextStep();
      button.value = 'Stop';
    } else {
      button.value = 'Run';
    }
  },


 /** ******************************************************************************************************************
  * Button Handler - Next Step - One Step only
  */
  buttonNextStep : function() {
    if (!this.running)
      this.nextStep();
  },


 /** ******************************************************************************************************************
  * Button Handler - Clear World
  */
  buttonClear : function() {
    if (this.running) {
      this.clear = true;
      this.running = false;
      document.getElementById('buttonRun').value = 'Run';
    } else {
      this.clearWorld();
    }
  },


 /** ******************************************************************************************************************
  * Button Handler - Export State
  */
  exportState : function() {
    var cellCode = '';

    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.columns; j++) {
        if (this.world[i][j]) {
         cellCode += i < 10 ? '0'+i : i;
         cellCode += j < 10 ? '0'+j : j;
        }
      }
    }

    if (cellCode.length != 0) {
      document.getElementById('exportUrlLink').href = '?s={"state":"'+ cellCode +'"}';
      var url = '';
      if (window.location.href.indexOf('?') == -1) {
       url = window.location.href;
      } else {
       url = window.location.href.slice(0, window.location.href.indexOf('?'));
      }
      document.getElementById('exportTinyUrlLink').href = 'http://tinyurl.com/api-create.php?url='+ url +'?s={"state":"'+ cellCode +'"}';
      document.getElementById('exportUrl').style.display = 'inline';
    }
  },

  // Helpers

 /** ******************************************************************************************************************
  * Get URL Parameters 
  */
  getUrlVars : function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    return vars;
  },


 /** ******************************************************************************************************************
  * Copy Array by Value
  */
  arrayCopy : function(src) {
    var x = src.length, y = src[0].length;
    var dest = [];
    for (var i = 0; i < x; i++) {
      dest[i] = [];
      for (var j = 0; j < y; j++) {
        dest[i][j] = src[i][j];
      }
    }

    return dest;
  },


 /** ******************************************************************************************************************
  * Register Event
  */
  addEvent : function (element, event, handler, capture) {
    if (/msie/i.test(navigator.userAgent)) {
      element.attachEvent('on' + event, handler);
    } else {
      element.addEventListener(event, handler, capture);
    }
  }

};

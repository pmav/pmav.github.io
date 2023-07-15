/**
 * Rainbow Colors
 * http://pmav.eu
 * v1.1
 */

(function() {

  var COLORS = {

    colorsTextarea : null,
    colorsTextareaCurrentValue : "",

    init : function() {
      var i, urlParameter;
      
      Event.on('share', 'click', this.share);
      Event.on('gethex', 'click', this.addColor);
      Event.on('colorslist', 'keyup', this.cleanupColorList);
      
      this.colorsTextarea = Dom.get('colorslist');

      urlParameter = this.getUrlParameter("u");
      
      if (urlParameter !== undefined) {
        urlParameter = urlParameter.split(":");

        this.colorsTextarea.value = "";
        for (i = 1; i < urlParameter.length; i++) {
          this.colorsTextarea.value += urlParameter[i] + " ";
        }

        this.colorsTextarea.value = this.trim(this.colorsTextarea.value);

        return parseInt(urlParameter[0], 10);
      }

      return 10;
    },


    share : function() {
      var i, url, colorlist;

      url = (window.location.href.indexOf('?') === -1) ? window.location.href : window.location.href.slice(0, window.location.href.indexOf('?'));
      url += "?u=";
      url +=  parseInt(Dom.get('slider-value').innerHTML, 10);

      colorlist = COLORS.validColorList(false);

      for (i = 0; i < colorlist.length; i++) {
        url += ":"+colorlist[i];
      }

      Dom.get("shareoutput").innerHTML = "&nbsp;<a href=\"http://tr.im/marklet?url="+encodeURIComponent(url)+"\">http://tr.im...</a> or <a href=\""+url+"\">direct link</a>";
    },


    addColor : function() {
      COLORS.colorsTextarea.value = COLORS.trim(COLORS.colorsTextarea.value + ' ' + picker.get("hex"));
      COLORS.generateColors();
    },


    cleanupColorList : function() {
      if (COLORS.colorsTextarea.value !== COLORS.colorsTextareaCurrentValue) {
        COLORS.generateColors();
      }
    },


    validColorList : function(convert2rgb) {
      var i, cleanColorList, colorList;

      colorList = COLORS.trim(this.colorsTextarea.value).split(' ');
      cleanColorList = [];

      // Clean up
      for (i = 0; i < colorList.length; i++) {
        if (colorList[i] !== "") {
          cleanColorList.push(colorList[i]);
        }
      }

      if (cleanColorList.length < 2) {
        throw 'Not enough colors (minimum is 2)';
      }

      // Convert to valid RGB
      if (convert2rgb) {
        for (i = 0; i < cleanColorList.length; i++) {
          cleanColorList[i] = COLORS.convert.hex2rgb(cleanColorList[i]);
        }
      }

      return cleanColorList; // Return a valid color list
    },


    generateColors : function() {
      var i, k, n = 0, intervals, colorsList, outputCode = '', colorCode = '', redInterval, greenInterval, blueInterval, c1, c2, hexColorCode;

      try {

        colorsList = COLORS.validColorList(true);
        Dom.get('error').style.display = 'none';

        intervals = parseInt(Dom.get('slider-value').innerHTML, 10) + 1;

        for (k = 0; k < (colorsList.length - 1); k++) {
          c1 = colorsList[k];
          c2 = colorsList[k+1];

          redInterval = (c2.red - c1.red) / intervals;
          greenInterval = (c2.green - c1.green) / intervals;
          blueInterval = (c2.blue - c1.blue) / intervals;

          if ((k+1) == (colorsList.length - 1)) {
            intervals++;
          }

          for (i = 0; i < intervals; i++) {
            hexColorCode = COLORS.convert.rgb2hex(Math.round(c1.red), Math.round(c1.green), Math.round(c1.blue));
            colorCode = colorCode + '<p>&nbsp;#'+hexColorCode+' <span style="background: #'+hexColorCode+';">&nbsp;</span></p>';
            outputCode = outputCode + '#' + hexColorCode + ' ';
            c1.red = c1.red  + redInterval;
            c1.green = c1.green + greenInterval;
            c1.blue = c1.blue + blueInterval;
            n++;
          }
        }

        Dom.get('colors').innerHTML = colorCode;
        Dom.get('colorslistoutput').innerHTML = outputCode;
        Dom.get('colorsnumberoutput').innerHTML = n;

      } catch (errorMessage) {
        Dom.get('error').innerHTML = errorMessage;
        Dom.get('error').style.display = 'block';
      }

      COLORS.colorsTextareaCurrentValue = COLORS.colorsTextarea.value;

      return false;
    },


    convert : {

      hex2rgb : function(hexColor) {
        var reg =/^([0-9a-f]{2}){3}$/i, color = {};

        if (hexColor[0] === '#') {
          hexColor = hexColor.substring(1, hexColor.length);
        }

        if (hexColor.length < 6) {
          throw 'Incomplete color code ('+hexColor.toUpperCase()+')';
        }

        if (!reg.test(hexColor)) {
          throw 'Wrong color code ('+hexColor.toUpperCase()+')';
        }

        color.red = parseInt(hexColor.substring(0, 2), 16);
        color.green = parseInt(hexColor.substring(2, 4), 16);
        color.blue = parseInt(hexColor.substring(4, 6), 16);

        return color;
      },


      rgb2hex : function(red, green, blue) {
        return (red < 16 ? '0' : '') + red.toString(16).toUpperCase() + (green < 16 ? '0' : '') + green.toString(16).toUpperCase() +(blue < 16 ? '0' : '') + blue.toString(16).toUpperCase();
      }

    },


    trim : function(str, chars) {
      chars = chars || "\\s";
      return str.replace(new RegExp("^[" + chars + "]+", "g"), "").replace(new RegExp("[" + chars + "]+$", "g"), "");
    },


    getUrlParameter : function(name) {
      var hash, hashes, i;

      this.urlParameters = [];
      hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

      for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        this.urlParameters.push(hash[0]);
        this.urlParameters[hash[0]] = hash[1];
      }

      return this.urlParameters[name];
    }


  };

  // YAHOO

  var Event = YAHOO.util.Event, Dom = YAHOO.util.Dom, lang = YAHOO.lang, picker, slider, bg = "slider-bg", thumb = "slider-thumb";
  var topConstraint = 0, bottomConstraint = 400;

  Event.onDOMReady(function() {

    // Slider
    slider = YAHOO.widget.Slider.getHorizSlider(bg, thumb, topConstraint, bottomConstraint);

    slider.subscribe("change", function() {
      var value = parseInt(this.getValue() *(254.0/400.0), 10);
      Dom.get("slider-value").innerHTML = value + ' color' + (value == 1 ? '' : 's');
      COLORS.generateColors();
    });

    slider.keyIncrement = 1;
    slider.setValue(COLORS.init() * 2);

    // Color Picker
    picker = new YAHOO.widget.ColorPicker("colorpicker", {
      showhsvcontrols: true,
      showhexcontrols: true,
      images: {
        PICKER_THUMB: "assets/images/picker_thumb.png",
        HUE_THUMB: "assets/images/hue_thumb.png"
      }
    });

  });

})();

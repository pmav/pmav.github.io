/**
 * Pictar
 * http://pmav.eu
 * v1.0 - 07/Jul/2013
 * v1.1 - 22/Jan/2015
 */
var PICTAR = {

    state: {
        canvas: null,
        fontSize: 150,
        horizontal: 0,
        vertical: 15,
        lineSpacing: 110
    },

    init: function () {

        this.state.canvas = document.getElementById("avatar");

        this.registerHandlers();

        this.loadState();

        this.draw(); // 1st draw.
    },

    registerHandlers: function () {

        // Export.

        $("#export-imgur").click(this.exportImgur);


        // Input.

        $("textarea").keyup(this.draw);

        $("input[type=checkbox]").change(function (event, ui) {
            PICTAR.draw();
        });

        // Colors.

        $(".color-picker").spectrum({
            showButtons: false,
            showInput: true,
            move: this.draw
        });

        $("#font-select").change(function () {
            PICTAR.draw(1);
            PICTAR.draw();
        });

        // Sliders.

        $("#size-slider").slider({
            min: 10,
            max: 300,
            value: 150
        }).on("slide", function (event, ui) {
                PICTAR.state.fontSize = ui.value;
                PICTAR.draw();
            });

        $("#horizontal-slider").slider({
            min: -150,
            max: 150,
            value: 0,
            slide: function (event, ui) {
                PICTAR.state.horizontal = ui.value;
                PICTAR.draw();
            }
        });

        $("#vertical-slider").slider({
            min: -150,
            max: 150,
            value: 15
        }).on("slide", function (event, ui) {
            PICTAR.state.vertical = ui.value;
            PICTAR.draw();
        });

        $("#line-spacing-slider").slider({
            min: -200,
            max: 200,
            value: 110
        }).on("slide", function (event, ui) {
            PICTAR.state.lineSpacing = ui.value;
            PICTAR.draw();
        });

        // Buttons

        $("#button-random").click(function() {
            PICTAR.randomState();

            //PICTAR.draw(1);
            PICTAR.draw();
        });
    },

    randomState: function () {
        var getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        var getRandomColorHex = function () {
            return "#" + getRandomInt(0, 255).toString(16) + getRandomInt(0, 255).toString(16) + getRandomInt(0, 255).toString(16);
        }
        var textChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var fontOptions = $('#font-select option');

        var queryString = "";
        queryString += "text=" + textChars[getRandomInt(0, textChars.length - 1)] + textChars[getRandomInt(0, textChars.length - 1)];
        queryString += "&fontSize=" + getRandomInt(20, 300);
        queryString += "&font=" + $(fontOptions[getRandomInt(0, fontOptions.length - 1)]).val();
        queryString += "&bold=" + (getRandomInt(0, 1) === 1 ? "true" : "false");
        queryString += "&italic=" + (getRandomInt(0, 1) === 1 ? "true" : "false");
        queryString += "&backgroundColorStart=" + getRandomColorHex();
        queryString += "&backgroundColorEnd=" + getRandomColorHex();
        queryString += "&foregroundColor=" + getRandomColorHex();
        queryString += "&horizontalSpacing=" + getRandomInt(-50, 50);
        queryString += "&verticalSpacing=" + getRandomInt(-50, 50);
        queryString += "&lineSpacing=" + getRandomInt(0, 0);

        PICTAR.loadState(Base64.encode(queryString));
    },

    loadState: function (state) {
        state = state || $.getUrlVar('s');

        if (state !== undefined) {
            state = $.getVars(Base64.decode(state));

            $("#text").val(state.text.replace(/\\n/, "\n"));

            $("#font-select").val(state.font);
            $("#font-bold").prop("checked", state.bold === "true");
            $("#font-italic").prop("checked", state.italic === "true");

            $("#background-color-start").spectrum("set", state.backgroundColorStart);
            $("#background-color-end").spectrum("set", state.backgroundColorEnd);
            $("#foreground-color").spectrum("set", state.foregroundColor);

            var v = parseInt(state.fontSize, 10);
            $("#size-slider").slider("value", v);
            PICTAR.state.fontSize = v;

            v = parseInt(state.horizontalSpacing, 10);
            $("#horizontal-slider").slider("value", v);
            PICTAR.state.horizontal = v;

            v = parseInt(state.verticalSpacing, 10);
            $("#vertical-slider").slider("value", v);
            PICTAR.state.vertical = v;

            v = parseInt(state.lineSpacing, 10);
            $("#line-spacing-slider").slider("value", v);
            PICTAR.state.lineSpacing = v;
        }
    },

    draw: function (fontSize) {
        var tstate = PICTAR.state;
        var canvas = tstate.canvas;

        fontSize = fontSize || tstate.fontSize;

        // Get config.
        var backgroundColorStart = $("#background-color-start").spectrum("get").toHexString();
        var backgroundColorEnd = $("#background-color-end").spectrum("get").toHexString();
        var foregroundColor = $("#foreground-color").spectrum("get").toHexString();

        var text = $("#text").val().split("\n");
        var font = $("#font-select").val();
        var bold = $("#font-bold").is(":checked");
        var italic = $("#font-italic").is(":checked");

        var context = canvas.getContext('2d');

        // Background.
        var backgroundGradient = context.createLinearGradient(0, 0, 0, canvas.height);
        backgroundGradient.addColorStop(0, backgroundColorStart);
        backgroundGradient.addColorStop(1, backgroundColorEnd);

        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, 256, 256);

        // Text.
        context.fillStyle = foregroundColor;
        context.font = (italic ? "italic " : "") + (bold ? "bold " : "") + fontSize + "px " + font;
        context.textAlign = "center";
        context.textBaseline = "middle";

        var x = (canvas.width / 2) + tstate.horizontal;
        var y = (canvas.height / 2) + tstate.vertical;

        for (var i = 0; i < text.length; i++) {
            context.fillText(text[i], x, y + (tstate.lineSpacing * i));
        }

        // Export (Data URL).
        var dataURL = canvas.toDataURL("image/png");
        $("#export-image").attr("src", dataURL);
        $("#export-data-url").attr("href", dataURL);

        // Export (Link).
        var queryString = "";
        queryString += "text=" + $('#text').val().replace(/\n/, "\\n");
        queryString += "&fontSize=" + fontSize;
        queryString += "&font=" + font;
        queryString += "&bold=" + bold;
        queryString += "&italic=" + italic;
        queryString += "&backgroundColorStart=" + backgroundColorStart;
        queryString += "&backgroundColorEnd=" + backgroundColorEnd;
        queryString += "&foregroundColor=" + foregroundColor;
        queryString += "&horizontalSpacing=" + tstate.horizontal;
        queryString += "&verticalSpacing=" + tstate.vertical;
        queryString += "&lineSpacing=" + tstate.lineSpacing;

        $("#export-data-link").attr("href", "./?s=" + Base64.encode(queryString));
    },


    exportImgur: function () {
        $("#export-result").html("");

        var img = document.getElementById("avatar").toDataURL("image/png").split(',')[1];

        $.ajax({
            url: 'https://api.imgur.com/3/image',
            type: 'POST',
            headers: { "Authorization": "Client-ID c29f91c26993e7b" },
            data: {
                image: img
            },
            dataType: 'json',
            success: function (response) {
                var link = response.data.link;
                $("#export-result").html("Images at <a href='"+link+"' target='_blank'>256x256</a>" +
                    " <a href='http://api.rethumb.com/v1/width/128/"+link+"' target='_blank'>128x128</a>" +
                    " <a href='http://api.rethumb.com/v1/width/64/"+link+"' target='_blank'>64x64</a>" +
                    " <a href='http://api.rethumb.com/v1/width/32/"+link+"' target='_blank'>32x32</a>.");
            },
            error: function () {
                $("#export-result").html("Error, please try again.");
            }
        });

        return false;
    }


};

$(document).ready(function () {
    WebFont.load({
        google: {
            families: ["Droid+Serif", "Arvo", "Lora", "Rokkitt", "PT+Serif", "Open+Sans", "Oswald", "Droid+Sans", "Lato", "PT+Sans", "Lobster", "Unkempt", "Special+Elite", "Changa+One", "Chewy", "The+Girl+Next+Door", "Shadows+Into+Light", "Coming+Soon", "Dancing+Script", "Crafty+Girls"]
        }
    });

    PICTAR.init();
});


/**
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 */
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
}

$.extend({
    getVars: function (data) {
        var vars = [], hash;
        var hashes = data.split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});
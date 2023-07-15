$(function() {

    var NAMEGENERATOR = {

        generate : function(min, max) {
            var terms = $("#terms").val();
            terms = terms.replace(/\n/g, " ");
            terms = terms.split(" ");

            var finalTerms = [];
            for (var i = 0; i < terms.length; i++) {
                if (terms[i].length > 0) {
                    finalTerms[finalTerms.length] = terms[i];
                }
            }

            if (finalTerms.length == 1 && finalTerms[0].length > 1) {
                var term1 = finalTerms[0].substr(0, Math.floor(finalTerms[0].length/2));
                var term2 = finalTerms[0].substr(term1.length);

                finalTerms[0] = term1;
                finalTerms[1] = term2;
            }

            this.combineTerms(finalTerms, min, max);
        },


        combineTerms : function(terms, min, max) {
            var i, j, k, groups = [];
            
            for (i = 0; i < terms.length; i++) {
                for (j = i+1; j < terms.length; j++) {
                    groups[groups.length] = {
                        "first" : terms[i],
                        "second": terms[j]
                    };
                    groups[groups.length] = {
                        "first" : terms[j],
                        "second": terms[i]
                    };
                }
            }

            var maxlength = 0, result, results = [];
            for (i = 0; i < groups.length; i++) {
                var first = groups[i].first;
                var second = groups[i].second;

                // a... + b...
                for (j = 1; j < first.length + 1; j++) {
                    for (k = 1; k < second.length + 1; k++) {
                        result = first.substring(0, j)+second.substring(0, k);

                        if (result.length <= max && result.length >= min) {
                            if (!this.contains(results, result)) {
                                results[results.length] = result;
                            }
                        }
                    }
                }

                // a... + ...b
                for (j = 1; j < first.length + 1; j++) {
                    for (k = second.length-1; k >= 0; k--) {
                        result = first.substring(0, j)+second.substring(k, second.length);

                        if (result.length <= max && result.length >= min) {
                            if (!this.contains(results, result)) {
                                results[results.length] = result;
                            }
                        }
                    }
                }
            }

            this.output(results);
        },


        contains : function(terms, term) {
            var i;
            
            for (i = 0; i < terms.length; i++) {
                if (terms[i] === term) {
                    return true;
                }
            }

            return false;
        },


        output : function(results) {
            var i, html = "";

            results.randomize();

            for (i = 0; i < results.length; i++) {
                html += "<span>"+results[i]+"</span> ";
            }

            $("#output").html(html);
        },


        createSlider : function(min, max) {
            $("#slider1").slider({
                range: true,
                min: min,
                max: max,
                values: [3, 6],
                slide : function(event, ui) {
                    NAMEGENERATOR.generate(ui.values[0], ui.values[1]);
                    $("#length-min").html(ui.values[0]);
                    $("#length-max").html(ui.values[1]);
                }
            });
            
            $("#length-min").html(3);
            $("#length-max").html(6);
        },


        init : function() {
            this.createSlider(2, 32);

            $("#generate").bind("click", function(){
                NAMEGENERATOR.generate($("#slider1").slider("values", 0), $("#slider1").slider("values", 1));
            });

            $("#terms").keyup(function() {
                NAMEGENERATOR.generate($("#slider1").slider("values", 0), $("#slider1").slider("values", 1));
            });
            
            this.generate($("#slider1").slider("values", 0), $("#slider1").slider("values", 1));
        }
    };

    NAMEGENERATOR.init();

});

Array.prototype.randomize  = function (){
    this.sort(
        function(a, b) {
            return 0.5 - Math.random();
        }
        );
};

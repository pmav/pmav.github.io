$(document).ready(function(){

    // CSS Fix
    if ($.browser.webkit) {
        $('body').addClass('webkit');
    }

	/*
    // Box overlayers
    $(".item img").mouseover(function () {
        var offset = $(this).offset();
        var overlayer = $('<a></a>').addClass("overlayer");
        
        $("body").append(overlayer);

        overlayer.css("left", offset.left).css("top", offset.top).css("opacity", 0.9).mouseout(
            function () {
                $(this).fadeOut(1000, function () {
                    $(this).remove();
                });
            }
            ).html($(this).attr("alt")).attr("href", $(this).parent().attr("href")).show();
    });
	*/

    // Search
    $("#search").focus(function() {
        if (this.value === "search...") {
            this.value = "";
        }
    });

    $("#search").blur(function() {
        if (this.value === "") {
            this.value = "search...";
        }
    });

    $("#search").keyup(function() {

        var text = this.value;
        var that = this;

        window.setTimeout(function() {

            var searchText = that.value;

            if (searchText === text) {

                var count = 0;

                $(".item a.image").each(function() {

					var element = $(this).parent().parent();
					
                    if ($(this).attr("title").toLowerCase().indexOf(searchText) !== -1) {
                        count = count + 1;
                        element.fadeTo("slow", "1");
                    } else {
                        if (element.css("opacity") !== 0.1) {
                            element.fadeTo("slow", "0.1");
                        }
                    }
                });

                if (count > 0 && searchText.length > 0) {
                    $("#search-legend").text("I've found "+count+" thing"+(count > 1 ? "s" : "")+" with").hide();
                    $("#search-legend").fadeIn(1000);
                } else {
                    $("#search-legend").fadeOut(1000);
                }
            }

        }, 500);
    });

});
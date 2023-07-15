var FLYMD5 = {

	init : function() {
		this.addEvent(document.getElementById('input'), 'keyup', FLYMD5.inputChangeHandler);
	},
	
	
	inputChangeHandler : function(event) {
		document.getElementById('output').value = MD5(document.getElementById('input').value).toUpperCase();
	},
	
	
	addEvent : function (element, event, handler, capture) {
    	if (/msie/i.test(navigator.userAgent)) {
			element.attachEvent('on' + event, handler);
	    } else {
			element.addEventListener(event, handler, capture ? true : false);
		}
	}
	
}

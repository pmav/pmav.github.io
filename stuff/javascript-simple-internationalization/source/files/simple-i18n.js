/**
 * Javascript Simple Internationalization
 *
 * http://pmav.eu/stuff/javascript-simple-internationalization
 * pmav, 2011
 */
 
var i18nFactory = function(data) {

	// Attributes.

	var cache = {};
	
	var languages = new Array();

	// Constructor.

	for (var i = 0; i < data.length; i++)
	{
		var languageID = data[i][0];

		if (cache[languageID] == undefined)
		{
			cache[languageID] = {};
			
			languages[languages.length] = languageID;
		}

		cache[languageID][data[i][1]] = data[i][2];
	}
	
	// Public API.

	return {
		get : function(languageID)
		{
			return cache[languageID];
		},
		
		getLanguages : function()
		{
			return languages;
		}
	};
};

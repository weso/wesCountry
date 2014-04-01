String.format = function(pattern)
{
	for (var i = 1; i < arguments.length; i++)
	{
		var regex = new RegExp('\\{' + (i - 1) + '\\}', 'g');
		pattern = pattern.replace(regex, arguments[i]);
	}
	return pattern;
};

/**
 * wesCountry object.
 * @constructor
 */
var wesCountry = new (function() {
	this.version = "1.0.0.0";
	
	function s4() {
  		return Math.floor((1 + Math.random()) * 0x10000)
    		.toString(16)
        	.substring(1);
	}

	this.guid = function() {
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         	s4() + '-' + s4() + s4() + s4();
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                              MERGING OPTIONS
	////////////////////////////////////////////////////////////////////////////////
	
	this.mergeOptionsAndDefaultOptions = function(options, defaultOptions) {
		if (options) {
			if (typeof options === "string")
				options = { container: options };
		
			var auxOptions = this.clone(defaultOptions);
			
			for (var option in options)
				auxOptions[option] = mergeOptions(auxOptions[option], options[option]);
			
			options = auxOptions;
		}
		else
			options = this.clone(defaultOptions);
			
		return options;
	};
	
	function mergeOptions(to, from) {
		if (from instanceof Array) {
			return from;
		}
		else if (typeof from === "object") {
			for (var option in from) {
				to[option] = mergeOptions(to[option], from[option]);
			}

			return to;
		}
		else
			return from;
	};
	
	this.clone = function(obj) {
		// Not valid for copying objects that contain methods
	    //return JSON.parse(JSON.stringify(obj));
	    if (null == obj || "object" != typeof obj) return obj;
	    
	    var copy = obj.constructor();
	    
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    
	    return copy;
	};
	
	////////////////////////////////////////////////////////////////////////////////
	//                              COLOUR RANGE
	////////////////////////////////////////////////////////////////////////////////	
	
	this.colourRange = function(range, numberOfElements) {
		if (numberOfElements <= range.length)
			return range.slice(0, numberOfElements);
			
		var elementsPerRange = numberOfElements / (range.length - 1);
		
		var colours = [];
	
		for (var i = 0; i < range.length - 1; i++) {
			var colour1 = hexToRGB(range[i]);
			var colour2 = hexToRGB(range[i + 1]);

			for (var j = 0; j < elementsPerRange; j++) {
				var percent = (j / elementsPerRange) * 100;
				colours.push(makeColourGradient(colour1, colour2, percent).cssColour);
			}
		}
		
		return colours;
	};
	
	function hexToRGB(hex) {
    	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    	if (!result) {
    		var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    		
    		result[1] = result[1] + "" + result[1];	
    		result[2] = result[2] + "" + result[2];	
    		result[3] = result[3] + "" + result[3];	
    	}
    	
    	return result ? {
        	r: parseInt(result[1], 16),
        	g: parseInt(result[2], 16),
        	b: parseInt(result[3], 16)
    	} : null;
	}
	
	function makeColourGradient(colour1, colour2, percent) {
		var newColour = {};

		function makeChannel(a, b) {
			return(a + Math.round((b - a) * (percent / 100)));
		}

		function makeColourPiece(num) {
			num = Math.min(num, 255);   // not more than 255
			num = Math.max(num, 0);     // not less than 0
		
			var str = num.toString(16);
		
			if (str.length < 2) {
				str = "0" + str;
			}
		
			return(str);
		}

		newColour.r = makeChannel(colour1.r, colour2.r);
		newColour.g = makeChannel(colour1.g, colour2.g);
		newColour.b = makeChannel(colour1.b, colour2.b);
		newColour.cssColour = "#" + 
							makeColourPiece(newColour.r) + 
							makeColourPiece(newColour.g) + 
							makeColourPiece(newColour.b);
						
		return(newColour);
	};
})();
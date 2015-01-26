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

	this.signature = {
		value: "by wesCountry",
		url: "http://wescountry.weso.es"
	}

	function s4() {
  		return Math.floor((1 + Math.random()) * 0x10000)
    		.toString(16)
        	.substring(1);
	}

	this.guid = function() {
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         	s4() + '-' + s4() + s4() + s4();
	}

	this.setSignature = function(options, svg) {
		var a = svg.a({}, wesCountry.signature.url).className('signature');

		a.text({
			x: options.width - 4,
			y: options.height - 4,
			value: wesCountry.signature.value
		}).style('fill: #aaa;font-family:Helvetica;font-size:10px;text-anchor: end;dominant-baseline: edge');
	}

	this.isFunction = function(obj) {
		var getType = {};
		return obj && getType.toString.call(obj) === '[object Function]';
	}

	this.getCssProperty = function(element, property) {
  	return window.getComputedStyle(element, null).getPropertyValue(property);
	}

	this.getFullHeight = function(element) {
    var elmHeight, elmMargin, elm = element;

    if (document.all) { // IE
      elmHeight = elm.currentStyle.height;

			var marginTop = parseInt(elm.currentStyle.marginTop, 10);
			var marginBottom = parseInt(elm.currentStyle.marginBottom, 10);

      elmMargin = marginTop + marginBottom;
    } else if (document.defaultView && document.defaultView.getComputedStyle) { // Mozilla
      elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }
		else {
			elmHeight = wesCountry.getCssProperty(elm, 'height');
			elmMargin = parseInt(wesCountry.getCssProperty(elm, 'margin-top')) + parseInt(wesCountry.getCssProperty(elm, 'margin-bottom'));
		}

		if (elmHeight && elmHeight.match) {
			elmHeight = elmHeight.match(/(\d*(\.\d*)?)px/);

			if (elmHeight && elmHeight.length > 0)
				elmHeight = Number(elmHeight[1]);
			else
				elmHeight = 0;
		}
		else
			elmHeight = 0;

    return (elmHeight + elmMargin);
	}

	this.registerEvent = function(element, event, handler) {
		if (element.attachEvent)
			element.attachEvent("on" + event, function() { handler.call(element); });
		else
			element.addEventListener(event, handler, false);
	}

	this.fireEvent = function(element, event) {
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, false, true);
			element.dispatchEvent(evt);
		}
		else
			element.fireEvent("on" + event);
	}
	
	this.hexToRgb = function(hex) {
    	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    	
    	return result ? {
        	r: parseInt(result[1], 16),
        	g: parseInt(result[2], 16),
        	b: parseInt(result[3], 16)
    	} : {
    		r: 0,
    		g: 0,
    		b: 0
    	};
	}
	
	this.shadeColour = function(colour, percent) {   
		if (typeof colour == 'string' || colour instanceof String || ! "r" in colour|| ! "g" in colour || ! "b" in colour)
			colour = wesCountry.hexToRgb(colour.toString());
			
    	var t = percent < 0 ? 0 : 255,
    	percent = percent < 0 ? percent * -1 : percent;
    	
    	return "#" + (0x1000000+(Math.round((t-colour.r)*percent)+colour.r)*0x10000+(Math.round((t-colour.g)*percent)+colour.g)*0x100+(Math.round((t-colour.b)*percent)+colour.b)).toString(16).slice(1);
	}

	this.makeGradientColour = function(colour1, colour2, percent) {
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
		
		if (typeof colour1 == 'string' || colour1 instanceof String || ! "r" in colour1|| ! "g" in colour1 || ! "b" in colour1)
			colour1 = wesCountry.hexToRgb(colour1.toString());
			
		if (typeof colour2 == 'string' || colour2 instanceof String || ! "r" in colour2|| ! "g" in colour2 || ! "b" in colour2)
			colour2 = wesCountry.hexToRgb(colour2.toString());
		
		newColour.r = makeChannel(colour1.r, colour2.r);
		newColour.g = makeChannel(colour1.g, colour2.g);
		newColour.b = makeChannel(colour1.b, colour2.b);
		newColour.cssColour = "#" +
							makeColourPiece(newColour.r) +
							makeColourPiece(newColour.g) +
							makeColourPiece(newColour.b);

		return(newColour);
	}
	
	this.makeGradientPalette = function(colours, length) {
		var palette = [];

  		var index = 0;
  		var colourLength = colours.length;

  		var intervalLength = length / (colourLength - 1);

  		while (index < colourLength - 1) {
    		for (var i = 0; i < intervalLength; i++) {
      			var colour1 = colours[index];
      			var colour2 = colours[index + 1];

  				palette.push(wesCountry.makeGradientColour(colour1, colour2, (i / intervalLength) * 100).cssColour);
  			}
    		index++;
  		}
  		
  		return palette;
	}

	////////////////////////////////////////////////////////////////////////////////
	//                              MERGING OPTIONS
	////////////////////////////////////////////////////////////////////////////////

	this.addOptions = function(opt1, opt2) {
		for (var o in opt2)
			if (!opt1[o])
				opt1[o] = opt2[o];

		return opt1;
	}

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
		if (!to)
			to = {};

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
	        if (obj.hasOwnProperty(attr))
						copy[attr] = this.clone(obj[attr]);
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

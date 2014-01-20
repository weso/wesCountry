String.format = function(pattern)
{
	for (var i = 1; i < arguments.length; i++)
	{
		var regex = new RegExp('\\{' + (i - 1) + '\\}', 'g');
		pattern = pattern.replace(regex, arguments[i]);
	}
	return pattern;
};

String.prototype.toFirstUpperCase = function() {
	var firstLetter = this[0].toUpperCase();
	var stringWithoutFirstLetter = this.substr(1);
	return firstLetter+stringWithoutFirstLetter;
}

if (typeof(exports) === "undefined")
	exports = new Object();
	
if (typeof(wesCountry) === "undefined")
	var wesCountry = {};

wesCountry.charts = new (function() {
	this.defaultOptions = {
		width: 600,
		height: 400,
        chartType: "bar",
        container: "body",
		margins: [10, 20, 10, 5],
		backgroundColour: "none",
		serieColours: ["#FCD271", "#FA5882", "#2BBBD8", "#102E37"],
		overColour: "#333",
		groupMargin: 4,
		barMargin: 8,
		sortSeries: false,
		valueOnItem: {
			show: true,
			margin: 5,
			"font-family": "Helvetica",
			"font-colour": "#aaa",
			"font-size": "16px",
		},
		xAxis: {
			title: "Months",
			colour: "none",
			margin: 10,
			tickColour: "none",
			values: ["Jan", "Feb", "Mar", "Apr", "May"],
			"font-family": "Helvetica",
			"font-colour": "#666",
			"font-size": "16px"
		},
		yAxis: {
			title: "Values",
			colour: "none",
			margin: 10,
			tickColour: "#ccc",
			"font-family": "Helvetica",
			"font-colour": "#aaa",
			"font-size": "16px",
			"from-zero": false
		},
		series: [{
            name: "First",
            values: [-1, 4, 5, 3, 6],
            urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }, {
            name: "Second",
            values: [1, 7, 5, 6, 4],
            urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }, {
        	name: "Third",
        	values: [0, 1, 2, 3, 4],
        	urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }],
        legend: {
	        show: true,
	        itemSize: 1,
	        "font-colour": "#666",
			"font-family": "Helvetica",
			"font-size": "16px"
        },
        tooltip: {
	        show: true,
	        style: {
			    display: "none",
			    padding: "0.8em 0.5em",
			    "font-size": "12px",
			    border: "0.1em solid #ccc",
			    "background-color": "#fff",
			    position: "absolute",
			    color: "#000",
	        }
        },
        events: {
	        "onmouseover": function(serie, pos, value) {
		    	var text = String.format("Series '{0}': ({1}, {2})", serie, pos, value);
		    	console.log(text);
		    	wesCountry.charts.showTooltip(text);
	        },
	        "onmouseout": function() {
	        	wesCountry.charts.hideTooltip();
	        },
	        "onclick": function() {
	        
	        }
        }
	};
	
	////////////////////////////////////////////////////////////////////////////////
	//                                 SORT SERIES
	////////////////////////////////////////////////////////////////////////////////
	
	// We evaluate the number of values of this series than are greater than the other series
	
	this.sortSeries = function(series) {
		series.sort(function(a, b) {
			var values1 = a.values;
			var values2 = b.values;
			var length = Math.max(values1.length, values2.length);
			
			var greatCounter = 0;
			
			for (var i = 0; i < length; i++) {
				var value1 = values1[i] ? values1[i] : 0;
				var value2 = values2[i] ? values2[i] : 0;
				
				if (value1 > value2)
					greatCounter++;
			}
			
			// We suppose that it's greater when han at least the half of the elements greater
			return greatCounter >= length / 2 ? -1 : 1;
		});
		
		return series;
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                     SVG
	////////////////////////////////////////////////////////////////////////////////
	
	this.getSVG = function(options) {
		var svgOptions = {
			width: options.width,
			height: options.height	
		};
		
		var svg = jSVG.svg(svgOptions);
		
		return svg;
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                 LEGEND
	////////////////////////////////////////////////////////////////////////////////
	
	this.showLegend = function(container, sizes, options) {
		var length = options.series.length;
	
		var xPos = sizes.width - sizes.marginRight * 0.2;
	
		for (var i = 0; i < length; i++) {
			var yPos = sizes.marginTop + (sizes.legendItemSize + sizes.barMargin) * 2.5 * i;
		
			container.circle({
				cx: xPos,
				cy: yPos,
				r: sizes.legendItemSize
			}).style(String.format("fill: {0}", options.serieColours[i % options.serieColours.length]));
			
			container.text({
				x: xPos - 2 * sizes.legendItemSize,
				y: yPos,
				value: options.series[i].name
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: end;dominant-baseline: middle", 
				options.legend["font-colour"],
				options.legend["font-family"],
				options.legend["font-size"]));
		}
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
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                   AXIS
	////////////////////////////////////////////////////////////////////////////////
	
	this.setAxisY = function(container, sizes, options) {
		// Y Axis

		container.line({
			x1: sizes.marginLeft + sizes.yAxisMargin,
			x2: sizes.marginLeft + sizes.yAxisMargin,
			y1: sizes.marginTop,
			y2: sizes.innerHeight + sizes.marginTop - sizes.xAxisMargin
		}).style(String.format("stroke: {0}", options.yAxis.colour));
	
		// Y Axis Ticks
		
		var length = sizes.ticksY + 1;
		
		// Line
		for (var i = 0; i < length; i++) {
			container.line({
				x1: sizes.marginLeft + sizes.yAxisMargin,
				x2: sizes.marginLeft + sizes.innerWidth,
				y1: sizes.marginTop + i * sizes.yTickHeight,
				y2: sizes.marginTop + i * sizes.yTickHeight
			}).style(String.format("stroke: {0}", options.yAxis.tickColour));
		}
			
		// Y Axis Labels
		for (var i = 0; i < length; i++) {	
			container.text({
				x: sizes.marginLeft + sizes.yAxisMargin / 1.8,
				y: sizes.marginTop + i * sizes.yTickHeight,
				value: (sizes.maxValue - i * sizes.valueInc).toFixed(0)
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: end;dominant-baseline: middle", 
				options.yAxis["font-colour"],
				options.yAxis["font-family"],
				options.yAxis["font-size"]));
		}
		
		// Y Axis Title
		var x = sizes.marginLeft;
		var y = sizes.marginTop + (sizes.innerHeight - sizes.xAxisMargin) / 2;
		
		container.text({
			x: x,
			y: y,
			value: options.yAxis.title,
			transform: String.format("rotate(-90 {0}, {1})", x, y)
		}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle", 
				options.yAxis["font-colour"],
				options.yAxis["font-family"],
				options.yAxis["font-size"]));
	}

	this.setAxisX = function(container, sizes, options) {		
		// X Axis
		
		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var minValuePos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin	
					+ sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;
	
		container.line({
			x1: sizes.marginLeft + sizes.yAxisMargin,
			x2: sizes.marginLeft + sizes.innerWidth,
			y1: minValuePos,
			y2: minValuePos
		}).style(String.format("stroke: {0}", options.xAxis.colour));
		
		// X Axis Ticks
		
		var length = sizes.maxValueLength;
		
		for (var i = 0; i < length; i++) {
			// Line
			
			var xPos = sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin 
				+ sizes.xTickWidth / 2 + (sizes.xTickWidth + 2 * sizes.groupMargin) * i;
		
			container.line({
				x1: xPos,
				x2: xPos,
				y1: sizes.marginTop,
				y2: sizes.innerHeight + sizes.marginTop - sizes.xAxisMargin
			}).style(String.format("stroke: {0}", options.xAxis.tickColour));
			
			// Label
			
			var value = options.xAxis.values[i] ? options.xAxis.values[i] : "";
			
			container.text({
				x: xPos,
				y: sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin / 2,
				value: value
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle", 
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"]));
		}
		
		// X Axis Title
		
		container.text({
			x: sizes.marginLeft + sizes.yAxisMargin + (sizes.innerWidth - sizes.yAxisMargin) / 2,
			y: sizes.marginTop + sizes.innerHeight + sizes.xAxisMargin / 2,
			value: options.xAxis.title
		}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle", 
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"]));
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                               MAX AXIS VALUES
	////////////////////////////////////////////////////////////////////////////////
	
	this.getMaxAndMinValuesAxisY = function(options) {
		var maxValue = 0, minValue = Number.MAX_VALUE;
		
		var length = options.series.length;
		var valueLength = null;
		var value = null;
		var maxValueLength = 0;
	
		for (var i = 0; i < length; i++) {
			valueLength = options.series[i].values.length;
			
			if (valueLength > maxValueLength)
				maxValueLength = valueLength;
			
			for (var j = 0; j < valueLength; j++) {
				value = options.series[i].values[j];
				
				if (value instanceof Array)
					value = value[1] ? value[1] : 0;
				
				if (value > maxValue)
					maxValue = value;
					
				if (value < minValue)
					minValue = value;
			}
		}
		
		if (options.yAxis["from-zero"] == true && minValue > 0)
			minValue = 0;
		
		
		var maxAndMinValues = this.getNearestNumber(minValue, maxValue);
	
		return { 
			max: maxAndMinValues.max, 
			min: maxAndMinValues.min, 
			valueLength: maxValueLength,
			inc: maxAndMinValues.inc
		};
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                              AUX FUNCTIONS
	////////////////////////////////////////////////////////////////////////////////	
	
	this.setBackground = function(container, sizes, options) {
		container.rectangle({
			x: 0,
			y: 0,
			width: sizes.width,
			height: sizes.height
		}).style(String.format("fill: {0}", options.backgroundColour));
	}	
	
	this.getNearestNumber = function(minValue, maxValue) {
		var pow = getNearestPow(maxValue - minValue);
		
		return  {
			max: Math.ceil(maxValue / pow) * pow,
			min: Math.floor(minValue / pow) * pow,
			inc: pow
		}
	}
	
	function getNearestPow(number) {
		var pow = 0;
	
		if (number < 15) {
			pow = 1;
		}
		else if (number < 30) {
			pow = 5;
		}
		else {
			var numberOfDigits = 1 + Math.floor(Math.log(number) / Math.log(10));
			pow = Math.pow(10, numberOfDigits - 1);
		}
		
		return pow;
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
	
	////////////////////////////////////////////////////////////////////////////////
	//                                   TOOLTIP
	////////////////////////////////////////////////////////////////////////////////
	
	var tooltip = null;
	
	this.createTooltip = function(options) {
		if (options.tooltip.show == true) {
			tooltip = document.getElementById("wesCountryTooltip");
			
			if (!tooltip) {
				tooltip = document.createElement("span");
				tooltip.id = "wesCountryTooltip";
				document.body.appendChild(tooltip);
				
				var style = "";
				
				for (var attr in options.tooltip.style) {
					var element = options.tooltip.style[attr];
						
					style += String.format("{0}:{1};", attr, element);
				}
				
				tooltip.setAttribute("style", style);
			}
		}
		else
			tooltip = null;
	}
	
	this.showTooltip = function(text) {
		if (!tooltip)
			return;
		
    	updateTooltipPos();
    	tooltip.innerHTML = text;
    	tooltip.style.display = "block";
    	window.onscroll = updateTooltipPos;
    }
    
    function updateTooltipPos() {
		if (!tooltip)
			return;    
    
    	var ev = arguments[0]?arguments[0]:event;
    	var x = ev.clientX;
    	var y = ev.clientY;
    	diffX = 24;
    	diffY = 0;
    	tooltip.style.top  = y - 2 + diffY + document.body.scrollTop + "px";
    	tooltip.style.left = x - 2 + diffX + document.body.scrollLeft + "px";
    }

    this.hideTooltip = function() {
		if (!tooltip)
			return;    
    
    	tooltip.style.display = "none";
    }

})();
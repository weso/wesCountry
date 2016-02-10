var jSVG = new (function() {
	function jSVGElement(elementName) {
		var namespace = "http://www.w3.org/2000/svg";
		var version = "1.1";
		var xlink = "http://www.w3.org/1999/xlink";
		
		var defaultSVGOptions = {
			width: 500,
			height: 500,
			version: version,
			xlink: xlink
		};
		
		var defaultElementOptions = {
			fill: "black",
			stroke: "none",
			"stroke-width": "1",
			x: "0",
			y: "0",
			width: "10",
			height: "10",
			r: "5",
			cx: "5",
			cy: "5",
			x1: 0,
			x2: 10,
			y1: 0,
			y2: 10
		};
		
		var attr = function(namespace, name, value) {
			this.namespace = namespace;
			this.name = name;
			this.value = value;
		};
		
		var myTag = elementName;
		var myAttributes = {};
		var myEvents = {};
		var myStyle = "";
		var myClass = "wesCountry";
		var myValue = undefined;
		var myChildNodes = [];
	
		this.svg = function(options) {
			/*if (options) {
				if (typeof options === "string")
					options = { container: options };
				
				//options = mergeOptions(defaultSVGOptions, options);
			}
			else
				options = {};
				*/
			if (!options)
				options = { };
		
			//this = document.createElementNS(namespace, "svg");
			return createElement(null, "svg", options, defaultSVGOptions);
	
			//setAttributes(this, options);
			//this.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
			
			//var container = options.container;
		
			//if (typeof container === "string")
			//	container = document.querySelector(container);
			
			//container.appendChild(this);
				
			//return this;
		}
		
		this.elementByName = function(name, options) {
			return createElement(this, name, options, defaultElementOptions);
		}	
		
		this.g = function(options) {
			return createElement(this, "g", options, defaultElementOptions);
		}
		
		this.path = function(options) {
			return createElement(this, "path", options, defaultElementOptions);
		}
			
		this.rectangle = function(options) {
			return createElement(this, "rect", options, defaultElementOptions);
		}
		
		this.circle = function(options) {
			return createElement(this, "circle", options, defaultElementOptions);
		}
		
		this.line = function(options) {
			return createElement(this, "line", options, defaultElementOptions);
		}
		
		this.text = function(options) {
			var element = createElement(this, "text", options, defaultElementOptions);
			element.value(options.value);
			
			return element;
		}
		
		this.a = function(options, url) {
			var anchor = createElement(this, "a", options, defaultElementOptions);
			anchor.attribute(xlink, "xlink:href", url);
			return anchor;
		}
	
		this.attribute = function(namespace, name, value) {
			myAttributes[name] = new attr(namespace, name, value);
			return this;
		}
		
		this.attributes = function(attributes) {
			myAttributes = attributes;
			return this;
		}
		
		this.style = function(value) {
			myStyle = value;
			return this;
		}
		
		this.className = function(value) {
			myClass = value;
			return this;
		}
		
		this.value = function(value) {
			myValue = value;
			return this;
		}
		
		this.event = function(name, action) {
			myEvents[name] = action;
			return this;
		}
		
		this.width = function() {
			return myAttributes.width.value;
		}
		
		this.height = function() {
			return myAttributes.height.value;
		}
		
		this.appendChild = function(node) {
			myChildNodes.push(node);
		}
		
		function createElement(parent, elementName, attributes, defaultAttributes) {
			var element = new jSVGElement(elementName);
			
			setAttributes(element, attributes, defaultAttributes);
			
			if (parent)
				parent.appendChild(element);
				
			return element;
		}
	
		function setAttributes(element, attributes, defaultAttributes) {
			attributes = mergeOptions(defaultAttributes, attributes);
			
			var attrs = {};
			
			for (var attribute in attributes) {
				attrs[attribute] = new attr(null, attribute, attributes[attribute]);
			}
			
			element.attributes(attrs);
		}
		
		function mergeOptions(defaultOptions, options) {
			var mergedOptions = cloneObject(defaultOptions);

			if (options) {
				for (var option in options)
					mergedOptions[option] = options[option];
			}
			
			return mergedOptions;
		}
		
		function cloneObject(obj) {
		    // Not valid for copying objects that contain methods
		    return JSON.parse(JSON.stringify(obj));
		}
		
		this.render = function() {
			var element = document.createElementNS(namespace, myTag);
		
			for (var attribute in myAttributes) {
				var attr = myAttributes[attribute];
				element.setAttributeNS(attr.namespace, attr.name, attr.value);	
			}
			
			element.setAttributeNS(null, "style", myStyle);
			element.setAttributeNS(null, "class", myClass);
			
			for (var event in myEvents) {
				element[event] = myEvents[event];
			}
			
			for (var i = 0; i < myChildNodes.length; i++)
				element.appendChild(myChildNodes[i].render());
			
			if (myValue) {
				var textNode = document.createTextNode(myValue);
				element.appendChild(textNode);
			}
			
			return element;
		}
		
		this.toString = function() {
			var attributes = "";
		
			for (var attribute in myAttributes) {
				var attr = myAttributes[attribute];
				attributes += String.format(' {0}="{1}"', attr.name, attr.value);
			}
			
			var childNodes = "";
			
			for (var i = 0; i < myChildNodes.length; i++)
				childNodes += myChildNodes[i].toString();
		
			return String.format('<{0} xmlns="{1}" xmlns:xlink="{2}" {3} class="{4}" style="{5}">{6}{7}</{0}>', 
					myTag, namespace, xlink, attributes, myClass, myStyle, childNodes, myValue ? myValue : "");
		}
	}
	
	return new jSVGElement();
	
})();String.format = function(pattern)
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
		title: "",
		foot: "",
		width: 600,
		height: 400,
    chartType: "bar",
    container: "body",
		margins: [10, 20, 10, 5],
		backgroundColour: "none",
		serieColours: ["#FCD271", "#FA5882", "#2BBBD8", "#01DFA5"],
		getElementColour: function(options, element, index) {
			if (!options || !options.serieColours
				|| !options.serieColours.length || options.serieColours.length < 1)
				return "black";

			return options.serieColours[index % options.serieColours.length];
		},
		getLegendElements: function(options) {
			return options.series;
		},
		overColour: "#333",
		showOverColour: true,
		backColour: "#eee", // Pie
		groupMargin: 4,
		barMargin: 8,
		sortSeries: false,
		valueOnItem: {
			show: true,
			margin: 2.5,
			"font-family": "Helvetica",
			"font-colour": "#555",
			"font-size": "11px",
			rotation: 0
		},
		nameUnderItem: {
			show: false,
			margin: 2.5,
			"font-family": "Helvetica",
			"font-colour": "#555",
			"font-size": "11px",
			rotation: 0
		},
		sizeByValue: false, // Scatter
		sizeByValueMaxRadius: 5, // Scatter
		sizeByValueMinRadius: 1, // Scatter
		showFitLine: { // Scatter
			show: true,
			colour: "#ccc",
			stroke: 2
		},
		mean: { // Bar
			show: false,
			stroke: 1,
			colour: "#444",
			margin: 3,
			text: "mean",
			"font-family": "Helvetica",
			"font-colour": "#333",
			"font-size": "12px",
			value: null,
			position: "TOP",
			side: "RIGHT"
		},
		median: { // Bar
			show: false,
			stroke: 1,
			colour: "#888",
			margin: 3,
			text: "median",
			"font-family": "Helvetica",
			"font-colour": "#333",
			"font-size": "12px",
			value: null,
			position: "TOP",
			side: "RIGHT"
		},
		maxBarWidth: 20, // Bar
		maxRankingRows: 8, // Ranking
		rankingElementShape: "circle", // Ranking
		rankingDirection: "lowerToHigher", // Ranking
		rankingLower: "Lower", // Ranking
		rankingHigher: "Higher", // Ranking
		xAxis: {
			title: "Months",
			colour: "none",
			margin: 10,
			tickColour: "none",
			values: ["Jan", "Feb", "Mar", "Apr", "May"],
			"font-family": "Helvetica",
			"font-colour": "#666",
			"font-size": "16px",
			maxValue: null,
			pow: null,
			rotation: 0
		},
		yAxis: {
			title: "Values",
			colour: "none",
			margin: 10,
			tickColour: "#ccc",
			"font-family": "Helvetica",
			"font-colour": "#aaa",
			"font-size": "16px",
			"from-zero": false,
			tickNumber: null,
			maxValue: null,
			pow: null
		},
		series: [{
			id: "1",
      name: "First",
      values: [-1, 4, 5, 3, 6],
      urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
    	}, {
      id: "2",
      name: "Second",
      values: [1, 7, 5, 6, 4],
      urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
      }, {
    	id: "3",
      name: "Third",
      values: [0, 1, 2, 3, 4],
      urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
    }],
    legend: {
	    show: true,
	    itemSize: 1,
	    "font-colour": "#666",
		"font-family": "Helvetica",
		"font-size": "16px",
		margin: 2
    },
    tooltip: {
	    show: true
    },
    events: {
	    "onmouseover": function(info) {
		    var text = String.format("Series '{0}': ({1}, {2})", info.serie, info.pos, info.value);

		    wesCountry.charts.showTooltip(text, info.event);
	    },
	    "onmouseout": function() {
	      wesCountry.charts.hideTooltip();
	    },
	    "onclick": function() {

	    }
    },
    vertex: {
      show: true
    },
    stroke: {
      width: 1
    },
    getName: function(element) {
    	return element.name ? element.name : "";
    },
    getValue: function(element) {
    	return element.value;
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

		wesCountry.setSignature(options, svg);

		return svg;
	}

	////////////////////////////////////////////////////////////////////////////////
	//                                 LEGEND
	////////////////////////////////////////////////////////////////////////////////

	this.showLegend = function(container, sizes, options) {
		if (!container)
			return;

		var elements = options.getLegendElements(options);
		var length = elements.length;

		var xPos = sizes.width - sizes.marginRight * 0.2;

		var legend = container.g();
		legend.className("wesCountry-legend");

		for (var i = 0; i < length; i++) {
			var yPos = sizes.marginTop + (sizes.legendItemSize + sizes.legendMargin) * i;

			var element = elements[i];

			var name = options.getName(element);

			var colour = options.getElementColour(options, element, i);

			legend.circle({
				cx: xPos,
				cy: yPos,
				r: sizes.legendItemSize
			}).style(String.format("fill: {0}", colour));

			legend.text({
				x: xPos - 2 * sizes.legendItemSize,
				y: yPos,
				value: name
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: end;dominant-baseline: middle",
				options.legend["font-colour"],
				options.legend["font-family"],
				options.legend["font-size"]));
		}
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
			
			var y = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin / 2;
			
			container.text({
				x: xPos,
				y: y,
				value: value,
				transform: String.format("rotate({0} {1} {2})", options.xAxis.rotation, xPos, y),
				"data-rotate": options.valueOnItem.rotation
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle",
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"])).className("x-axis-value");
		}

		// X Axis Title

		container.text({
			x: sizes.marginLeft + sizes.yAxisMargin + (sizes.innerWidth - sizes.yAxisMargin) / 2,
			y: sizes.marginTop + sizes.innerHeight + sizes.xAxisMargin / 2,
			value: options.xAxis.title
		}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle",
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"])).className("x-axis-title");
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

		if (maxValueLength == 0)
			minValue = 0;

		if (options.yAxis["from-zero"] === true && minValue > 0)
			minValue = 0;

		if (options.yAxis.maxValue && options.yAxis.maxValue > maxValue)
			maxValue = options.yAxis.maxValue;

		var maxAndMinValues = this.getNearestNumber(minValue, maxValue, options, options.yAxis.maxValue, options.yAxis.pow, options.yAxis.tickNumber);

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

	this.setBackground = function(container, sizes, options, pow) {
		container.rectangle({
			x: 0,
			y: 0,
			width: sizes.width,
			height: sizes.height
		}).style(String.format("fill: {0}", options.backgroundColour));
	}

	this.getNearestNumber = function(minValue, maxValue, options, maximum, pow, tickNumber) {
		if (maximum && isNumber(maximum))
			maxValue = maximum;

		if (!tickNumber)
			tickNumber = options.yAxis.tickNumber;

		if (!pow || !isNumber(pow))
			pow = getNearestPow(maxValue - minValue);

		var max = Math.ceil(maxValue / pow) * pow;
		var min = Math.floor(minValue / pow) * pow;
		var size = max - min;

		var inc = tickNumber && isNumber(tickNumber) ? size / (tickNumber - 1) : pow;

		return  {
			max: max,
			min: min,
			inc: inc
		}
	}

	function isNumber(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
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
				tooltip = document.createElement("div");
				tooltip.id = "wesCountryTooltip";
				tooltip.className = "wesCountry-tooltip";
				document.body.appendChild(tooltip);
			}
		}
		else
			tooltip = null;
	}

	this.showTooltip = function(text, event) {
		if (!tooltip)
			return;

    	updateTooltipPos(event);
    	tooltip.innerHTML = text;
    	tooltip.style.display = "block";
    	window.onscroll = updateTooltipPos;
    }

    function updateTooltipPos(event) {
			if (!tooltip)
				return;

    	var ev = arguments[0] ? arguments[0] : event;
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

	////////////////////////////////////////////////////////////////////////////////
	//                            TOOLTIP AUXILIARY
	////////////////////////////////////////////////////////////////////////////////


	this.getElementAttributes = function(element, event) {
		var attributes = element.attributes;
		var length = attributes.length;

		var obj = {};

		for (var i = 0; i < length; i++) {
			var attribute = attributes[i];
			var name = attribute.nodeName;
			var value = attribute.value;

			obj[name] = value;
		}

		obj.event = event;

		return obj;
	}

	this.setElementInfo =  function(element, obs) {
		for (var key in element) {
			obs["data-" + key] = element[key];
		}
	}
})();
////////////////////////////////////////////////////////////////////////////////
//                                  BAR CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.barChart = function(options) {
	return renderChart();

	function renderChart() {
		var positions = [];
		var bars = [];

		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
		options.yAxis["from-zero"] = true;

		if (options.sortSeries)
			options.series = wesCountry.charts.sortSeries(options.series);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// X Axis & Y Axis
		wesCountry.charts.setAxisY(g, sizes, options);
		wesCountry.charts.setAxisX(g, sizes, options);

		// Values
		var length = sizes.maxValueLength;
		var numberOfSeries = options.series.length;

		var barMargin = options.barMargin * sizes.xTickWidth / 100;
		var groupMargin = options.groupMargin * sizes.xTickWidth / 100;

		var barWidth = sizes.barWidth;

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var minValuePos = sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;

		// Values

		var valueList = [];

		var numColumnsDifferentFromZero = 0;

		// Get valueList for statistics

		for (var i = 0; i < length; i++) {
			for (var j = 0; j < numberOfSeries; j++) {
				var element = options.series[j];
				var value = element.values[i];

				if (!value)
					value = 0;

				if (value != 0)
					numColumnsDifferentFromZero++;

				valueList.push(value);
			}
		}

		var statistics = getStatistics(options, valueList);

		// Mean
		var side = statistics.mean - statistics.median >= 0 ? 1 : -1

		if (options.mean.position === "BOTTOM")
			showStatistics(g, statistics.mean, options.mean,
				side , sizes, minValuePos, maxHeight, numColumnsDifferentFromZero > 1);

		// Median
		var side = statistics.mean - statistics.median >= 0 ? -1 : 1
		side = statistics.mean == statistics.median ? -1 : side;

		if (options.median.position === "BOTTOM")
			showStatistics(g, statistics.median, options.median,
				side, sizes, minValuePos, maxHeight, numColumnsDifferentFromZero > 1);

		for (var i = 0; i < length; i++) {
			for (var j = 0; j < numberOfSeries; j++) {
				var element = options.series[j];
				var serie = options.getName(element);
				var id = element.id;
				var value = element.values[i];
				var url = element.urls ? element.urls[i] : "";
				var pos = options.xAxis.values[i];

				// Group bar
				element.group = "b" + wesCountry.guid()

				var barG = g.g({
					id: element.group,
				}).className("bar-group");

				// Store bar
				bars.push(element);

				if (!value)
					value = 0;

				var xPos = sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin * (2 * i + 1) + sizes.barMargin
						+ sizes.xTickWidth * i
						+ (barWidth + 2 * sizes.barMargin) * j;

				var yPos = getYPos(value, sizes, minValuePos, maxHeight);

				var height = (Math.abs(value) / (sizes.maxValue - sizes.minValue))
						* maxHeight;

				// Store X position
				positions.push(xPos);

				var rectangleOptions = {
					x: xPos,
					y: yPos,
					width: barWidth,
					height: height,
					id: id,
					serie: serie,
					value: value,
					pos: pos,
					"data-x": xPos,
					serie_pos: i,
					bar_pos: j
				};

				wesCountry.charts.setElementInfo(element, rectangleOptions);

				var colour = options.getElementColour(options, options.series[j], j);
				var rectangleStyle = String.format("fill: {0}", colour);

				// Events

				var selectBar = function(element) {
					var selectedBars = document.querySelectorAll(options.container + ' rect[selected]');

					for (var i = 0; i < selectedBars.length; i++)
						unselectBar(selectedBars[i]);

					element.colour = element.style.fill;
					
					if (options.showOverColour && options.overColour && options.overColour !== 'none') {
						element.style.fill = options.overColour;
					}
					
					element.setAttribute("selected", "selected");
				};

				var onmouseover = function(event) {
					selectBar(this);

					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				};

				var unselectBar = function(element) {
					element.style.fill = element.colour;
				};

				var onmouseout = function(event) {
					unselectBar(this);
					options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
				};

				var onclick = function(event) {
					this.style.fill = this.colour;
					options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
				};

				var r = null;

				if (url && url != "") {
					var a = barG.a({}, url ? url : "")
					r = a.rectangle(rectangleOptions);
				}
				else {
					r = barG.rectangle(rectangleOptions);
				}

				r.style(rectangleStyle).className(serie)
					.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick)
					.event("selectBar", function() {
						selectBar(this);
					}).event("unselectBar", function() {
						unselectBar(this);
					});

				// Value on bar

				var x = xPos + barWidth / 2;
				var y = yPos + height + (options.height / 100) * options.valueOnItem.margin;

				var anchor = "middle";

				if (options.valueOnItem.rotation > 0)
					anchor = "start";
				else if (options.valueOnItem.rotation < 0)
					anchor = "end";

				if (options.valueOnItem.show == true) {
					var t = barG.text({
						x: x,
						y: y,
						value: serie,
						transform: String.format("rotate({0} {1} {2})", options.valueOnItem.rotation, x, y),
						"data-inc-x": barWidth / 2,
						"data-rotate": options.valueOnItem.rotation
					}).style(String.format("fill: {0};font-family:{1};font-size:{2}; dominant-baseline: middle; text-anchor: {3};",
						options.valueOnItem["font-colour"],
						options.valueOnItem["font-family"],
						options.valueOnItem["font-size"],
						anchor));
					t.className("item-name");
				}

				// Name under item

				var x = xPos + barWidth / 2;
				var y = yPos - (options.height / 100) * options.nameUnderItem.margin;

				var anchor = "middle";

				if (options.nameUnderItem.rotation > 0)
					anchor = "start";
				else if (options.nameUnderItem.rotation < 0)
					anchor = "end";

				if (options.nameUnderItem.show == true) {
					var t = barG.text({
						x: x,
						y: y,
						value: value.toFixed(2),
						transform: String.format("rotate({0} {1} {2})", options.valueOnItem.rotation, x, y),
						"data-inc-x": barWidth / 2,
						"data-rotate": options.nameUnderItem.rotation
					}).style(String.format("fill: {0};font-family:{1};font-size:{2} ;dominant-baseline: middle; text-anchor: {3};",
						options.nameUnderItem["font-colour"],
						options.nameUnderItem["font-family"],
						options.nameUnderItem["font-size"],
						anchor));
					t.className("under-name");
				}
			}
		}

		// Show statistics

		if (options.mean.position !== "BOTTOM")
			showStatistics(g, statistics.mean, options.mean,
				side , sizes, minValuePos, maxHeight, numColumnsDifferentFromZero > 1);
		if (options.median.position !== "BOTTOM")
			showStatistics(g, statistics.median, options.median,
				side, sizes, minValuePos, maxHeight, numColumnsDifferentFromZero > 1);

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		// Sort handler

		svg.sort = function(sorter) {
			if (!sorter)
				return;

			bars.sort(sorter);

			var length = bars.length;

			for (var i = 0; i < length; i++) {
				var bar = bars[i];
				var group = bar.group;
				group = document.getElementById(group);

				if (!group)
					continue;

				var position = positions[i];

				var children = group.childNodes;
				var length2 = children.length;

				for (var j = 0; j < length2; j++) {
					// Get coordinates
					var child = children[j];
					var x = parseFloat(child.getAttribute("x"));
					var y = parseFloat(child.getAttribute("y"));
					var inc = child.getAttribute("data-inc-x");
					var cx = child.getAttribute("cx");
					var r = child.getAttribute("r");

					if (inc)
						inc = parseFloat(inc);
					else
						inc = 0;

					// Set new coordinates
					child.setAttribute("x", position + inc);

					if (cx) {
						cx = parseFloat(cx);
						r = parseFloat(r);

						child.setAttribute("cx", position + r);
					}

					// Set new rotation

					var rotation = child.getAttribute("data-rotate");

					if (rotation) {
						child.setAttribute("transform", String.format("rotate({0} {1} {2})", rotation, position + inc, y));
					}
				}
			}
		}

		return svg;
	}

	function getYPos(value, sizes, minValuePos, maxHeight) {
		if (value >= 0)	{
			return sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
					+ minValuePos
					- (value / (sizes.maxValue - sizes.minValue))
					* maxHeight;
		}
		else {
			return sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
					+ minValuePos
		}
	}

	function showStatistics(container, value, option, textSide, sizes, minValuePos, maxHeight, toShow) {
		if (option.show !== true || !toShow)
			return;

		var posY = getYPos(value, sizes, minValuePos, maxHeight);

		var x1 = sizes.marginLeft + sizes.yAxisMargin;
		var x2 = sizes.marginLeft + sizes.innerWidth;

		container.line({
			x1: x1,
			x2: x2,
			y1: posY,
			y2: posY,
			"stroke-width": option.stroke
		}).style(String.format("stroke: {0}", option.colour))
		.className("statistics");

		var sign = textSide >= 0 ? 1 : -1;

		// Side

		var text1 = option.text;
		var text2 = value && value.toFixed ? value.toFixed(2) : value;

		if (option.side === "LEFT") {
			var aux = text1;
			text1 = text2;
			text2 = aux;
		}

		// Text 1
		container.text({
			x: x1,
			y: posY - sign * (options.height / 100) * option.margin,
			value: text1
		}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor:start;dominant-baseline: middle",
			option["font-colour"],
			option["font-family"],
			option["font-size"])).className("statistics");

		// Text 2
		container.text({
			x: x2,
			y: posY - sign * (options.height / 100) * option.margin,
			value: text2
		}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor:end;dominant-baseline: middle",
			option["font-colour"],
			option["font-family"],
			option["font-size"])).className("statistics");
	}

	function getStatistics(options, values) {
		if (values == 0)
			return {
				median: options.median.value ? options.median.value : 0,
				mean: options.mean.value ? options.mean.value : 0
			}

		// Median
		values.sort(function(a,b) { return a - b; });

    var half = Math.floor(values.length / 2);
		var median = 0;

    if(values.length % 2)
        median = values[half];
    else
        median = (values[half - 1] + values[half]) / 2.0;

		// Mean
		var sum = 0;

		var length = values.length;

		for(var i = 0; i < length; i++) {
		    sum += values[i];
		}

		var mean = sum / length;

		return {
			median: options.median.value ? options.median.value : median,
			mean: options.mean.value ? options.mean.value : mean
		}
	}

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;
		var maxBarWidth = options.maxBarWidth * innerWidth / 100;

		// Max value & min value
		var maxAndMinValues = wesCountry.charts.getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min > 0 ? 0 : maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		// If max and min Value are the same we set difference
		if (minValue == maxValue) {
			minValue = minValue >= 0 ? 0 : minValue - 2;
			maxValue += 2;
		}

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = maxAndMinValues.valueLength != 0 ? (innerWidth - yAxisMargin) / maxAndMinValues.valueLength : 0;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth / options.series.length;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		if (barWidth > maxBarWidth) {
			var diff = barWidth - maxBarWidth;
			barMargin += diff / 2;
			barWidth = maxBarWidth;
		}

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}
};
////////////////////////////////////////////////////////////////////////////////
//                                  LINE CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.lineChart = function(options) {
	return this.generateLineChart(options, false);
}

////////////////////////////////////////////////////////////////////////////////
//                                  AREA CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.areaChart = function(options) {
	return this.generateLineChart(options, true);
}

// Auxiliary line fuction

wesCountry.charts.generateLineChart = function(options, area) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

		if (options.sortSeries)
			options.series = wesCountry.charts.sortSeries(options.series);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// X Axis & Y Axis
		wesCountry.charts.setAxisY(g, sizes, options);
		wesCountry.charts.setAxisX(g, sizes, options);

		// Values
		var length = options.series.length;
		var valueLength = sizes.maxValueLength;

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var zeroPos = sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;

		// Iteration
		for (var i = 0; i < length; i++) {
			// Position of zero y line
			var minValue = Math.max(0, sizes.minValue);
			var posZero = getYPos(minValue, sizes, zeroPos, maxHeight);

			var lineId = "l" + wesCountry.charts.guid();

			// Previous value, it could be null
			var valuePrevAux = null;
			// Previous non-null value position
			var valuePrevPos = 0;

			var serieGroup = g.g();
			serieGroup.className('serie_' + options.series[i].name);

			// Polygon path
			var pathD = "";
			if (area) {
				var path = serieGroup.path();
			}

			var firstValue = -1;

			for (var j = 0; j < valueLength; j++) {
				var element = options.series[i];
				var value = element.values[j];
				var valuePrev = j > 0 ? element.values[j - 1] : 0;

				var url = element.urls ? element.urls[j] : "";

				var id = element.id;
				var serie = element.name;
				var pos = options.xAxis.values[j];

				if (!value && value !== 0) {
					continue;
				}
				
				firstValue++;

				// If previous value is null we rescue the last non-null value

				if (!valuePrev && valuePrev !== 0) {
					valuePrev = valuePrevAux;
				}

				// We store this as the new previous value
				valuePrevAux = value;

				var xPos = getXPos(j, sizes, zeroPos);
				var yPos = getYPos(value, sizes, zeroPos, maxHeight);

				if (valuePrev) {
					var xPosPrev = getXPos(valuePrevPos, sizes, zeroPos);
					var yPosPrev = getYPos(valuePrev, sizes, zeroPos, maxHeight);
				}

				// We store this as the new previous value position
				valuePrevPos = j;

				var pointOptions = {
					cx: xPos,
					cy: yPos,
					r: 5,
					"class": lineId,
					id: id,
					serie: serie,
					value: value,
					pos: pos
				};

				wesCountry.charts.setElementInfo(element, pointOptions);

				var colour = options.getElementColour(options, options.series[i], i);
				var pointStyle = String.format("fill: {0}", colour);

				var setLineWidth = function(element, stroke) {
					var className = element.getAttribute("class");
					var lines = element.parentNode.querySelectorAll("line." + className);
					var length = lines.length;

					for (var k = 0; k < length; k++) {
						lines[k].setAttribute("stroke-width", stroke)
					}
				};

				var onmouseover = function(event) {
					this.setAttribute("r", 8);
					setLineWidth(this, 2);
					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				};

				var onmouseout = function(event) {
					this.setAttribute("r", 5);
					setLineWidth(this, 1);
					options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
				};

				var onclick = function(event) {
					this.setAttribute("r", 5);
					setLineWidth(this, 1);
					options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
				};

				if (options.vertex.show) {
					if (url && url != "") {
						var a = serieGroup.a({}, url ? url : "")
						a.circle(pointOptions)
						.style(pointStyle).event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
					}
					else {
						serieGroup.circle(pointOptions)
						.style(pointStyle).event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
					}
				}

				// Value on bar
				if (options.valueOnItem.show == true) {
					serieGroup.text({
						x: xPos,
						y: yPos - (options.height / 100) * options.valueOnItem.margin,
						value: value == 0 ? "0" : value.toFixed(2)
					}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
						options.valueOnItem["font-colour"],
						options.valueOnItem["font-family"],
						options.valueOnItem["font-size"])
					);
				}

				if (firstValue > 0) {
					if (valuePrev) {
						serieGroup.line({
							x1: xPosPrev,
							x2: xPos,
							y1: yPosPrev,
							y2: yPos,
							"stroke-width": options.stroke.width,
							"class": lineId
						}).style(String.format("stroke: {0}", options.serieColours[i % options.serieColours.length]))
						.event("onmouseover", function() { setLineWidth(this, options.stroke.width * 1.5); })
						.event("onmouseout", function() { setLineWidth(this, options.stroke.width); });

						pathD += String.format(" L{0} {1}", xPos, yPos);
					}
				}
				else {
					pathD = String.format("M{0} {1} L{2} {3}", xPos, posZero, xPos, yPos);
				}

			}

			if (pathD != "") {
				if (xPos)
					pathD += String.format(" L{0} {1} Z", xPos, posZero);

				if (area && pathD != "") {
					path.attribute(null, "d", pathD)
					.style(String.format("stroke: {0}; fill: {0}; opacity: 0.5", options.serieColours[i % options.serieColours.length]));
				}
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function getXPos(pos, sizes, zeroPos) {
		return sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin
				+ sizes.xTickWidth / 2 + (sizes.xTickWidth + 2 * sizes.groupMargin) * pos;
	};

	function getYPos(value, sizes, zeroPos, maxHeight) {
		return sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
			+ zeroPos
			- (value / (sizes.maxValue - sizes.minValue))
			* maxHeight;
	};

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;

		// Max value & min value
		var maxAndMinValues = wesCountry.charts.getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		// If max and min Value are the same we set difference
		if (minValue == maxValue) {
			minValue = minValue >= 0 ? 0 : minValue - 2;
			maxValue += 2;
		}

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = maxAndMinValues.valueLength != 0 ? (innerWidth - yAxisMargin) / maxAndMinValues.valueLength : 0;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth / options.series.length;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}
};
////////////////////////////////////////////////////////////////////////////////
//                                   PIE CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.pieChart = function(options) {
	return this.generatePieChart(options, false);
}

////////////////////////////////////////////////////////////////////////////////
//                                 DONUT CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.donutChart = function(options) {
	return this.generatePieChart(options, true);
}

// Auxiliary line fuction
wesCountry.charts.generatePieChart = function(options, donut) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

		if (options.sortSeries)
			options.series = wesCountry.charts.sortSeries(options.series);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// Values

		var numberOfPies = sizes.maxValueLength;

		if (numberOfPies <= 1) {
			var radius = Math.min(sizes.innerWidth - 2 * sizes.yAxisMargin, sizes.innerHeight - 2 * sizes.xAxisMargin) / 2;
			var startX = sizes.marginLeft + sizes.innerWidth / 2;
			var startY = sizes.marginTop + sizes.innerHeight / 2;
			var xInc = 0;
			var yInc = 0;
			var half = 1;
		}
		else if (numberOfPies == 2) {
			var radius = Math.min(sizes.innerWidth - 2 * sizes.yAxisMargin, sizes.innerHeight - 2 * sizes.xAxisMargin) / 4;
			var startX = sizes.marginLeft + radius;
			var startY = sizes.innerHeight / 2;
			var xInc = sizes.innerWidth - 2 * radius;
			var yInc = 0;
			var half = 2;
		}
		else {
			if (numberOfPies > 8)
				numberOfPies = 8;

			var radius = Math.min(sizes.innerWidth, sizes.innerHeight - 2 * sizes.xAxisMargin) / 4;
			var half = Math.ceil(numberOfPies / 2);

			var startX = sizes.marginLeft + radius;
			var startY = sizes.marginTop + radius
			var xInc = (sizes.innerWidth - half * radius * 2) / (half - 1) + 2 * radius;
			var yInc = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin - radius;
		}

		var donutRadius = 60 / 100 * radius;

		// It's presented in two rows

		for (var i = 0; i < numberOfPies; i++) {
			if (i < half) {
				var cx = startX + xInc * i;
				var cy = startY;
			}
			else {
				var rest = numberOfPies - half;

				var divisor = rest < half ? rest + 1 : rest - 1;
				var margin = (sizes.innerWidth - rest * radius * 2) / (divisor);
				xInc = margin + 2 * radius;
				var pieMarginLeft = rest < half ? margin : 0;

				var cx = sizes.marginLeft + pieMarginLeft + radius + xInc * (i % half);
				var cy = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin - radius;
			}

			// Label
			var labelY = cy + radius + sizes.xAxisMargin / 2;
			var text = options.xAxis.values[i] ? options.xAxis.values[i] : "";

			g.text({
				x: cx,
				y: labelY,
				value: text
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"]));

			// Events

			var onmouseover = function(event) {
				if (options.showOverColour && options.overColour && options.overColour !== 'none') {
					this.colour = this.style.fill;
					this.style.fill = options.overColour;

					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				}
			};

			var onmouseout = function(event) {
				if (options.showOverColour && options.overColour && options.overColour !== 'none') {
					this.style.fill = this.colour;
					options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
				}
			};

			var onclick = function(event) {
				this.style.fill = this.colour;
				options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
			};

			// Pie

			var total = 0;
			var numberOfGreaterThanZero = 0;

			var length = options.series.length;

			var holeColour = options.backgroundColour != "none" ? options.backgroundColour : '#fff';

			for (var j = 0; j < length; j++) {
				var value = Math.abs(options.series[j].values[i]);

				if (!value)
					value = 0;

				if (value != 0)
					numberOfGreaterThanZero++;

				total += value;
			}

			var angles = []

		  for(var j = 0; j < length; j++) {
				var value = Math.abs(options.series[j].values[i] / total * Math.PI * 2);

				if (!value)
					value = 0;

				angles[j] = value;
		    }

		    if (numberOfGreaterThanZero <= 1) {
		    	var colour = options.backColour;
		    	var serie = "";
		    	var value = "";
		    	var pos = "";
					var element = {};

		    	for(var j = 0; j < length; j++)
		    		if (angles[j] != 0) {
							colour = options.getElementColour(options, options.series[j], j);
		    			id = options.series[j].id;
		    			serie = options.series[j].name;
		    			value = Math.abs(options.series[0].values[j]).toFixed(2);
		    			pos = options.xAxis.values[i];

							element = options.series[j];

			    		break;
		    		}

					var circleOptions = {
						cx: cx,
						cy: cy,
						r: radius,
						id: id,
						serie: serie,
						value: value,
						pos: pos
					};

					wesCountry.charts.setElementInfo(element, circleOptions);

		    	g.circle(circleOptions).event("onmouseover", onmouseover)
					.event("onmouseout", onmouseout)
					.event("onclick", onclick)
		    	.style(String.format("fill: {0}", colour));

					if (donut) {
						g.circle({
							cx: cx,
							cy: cy,
							r: donutRadius,
						})
						.className('hole')
						.style(String.format("fill: {0}", holeColour));
					}
		    }
		    else {
			    var startangle = 0;

				for (var j = 0; j < length; j++) {
					var endangle = startangle + angles[j];
					var value = Math.abs(options.series[j].values[i]).toFixed(2);

					var serie = options.series[j].name;
					var url = options.series[j].urls ? options.series[j].urls[i] : "";
					var pos = options.xAxis.values[i];

					var element = options.series[j];

			        // Compute the two points where our wedge intersects the circle
			        // These formulas are chosen so that an angle of 0 is at 12 o'clock
			        // and positive angles increase clockwise.
			        var x1 = cx + radius * Math.sin(startangle);
			        var y1 = cy - radius * Math.cos(startangle);
			        var x2 = cx + radius * Math.sin(endangle);
			        var y2 = cy - radius * Math.cos(endangle);

			        var halfWay = startangle + (endangle - startangle) / 2;
			        var incRadius = radius + (radius / 100) * options.valueOnItem.margin;
			        var xMiddle = cx + incRadius * Math.sin(halfWay);
			        var yMiddle = cy - incRadius * Math.cos(halfWay);

			        // This is a flag for angles larger than than a half circle
			        var big = 0;

			        if (endangle - startangle > Math.PI)
			        	big = 1;

			        // We describe a wedge with an <svg:path> element
			        // Notice that we create this with createElementNS()

			        // This string holds the path details
			        var d = "M " + cx + "," + cy +  // Start at circle center
			            " L " + x1 + "," + y1 +     // Draw line to (x1,y1)
			            " A " + radius + "," + radius +       // Draw an arc of radius r
			            " 0 " + big + " 1 " +       // Arc details...
			            x2 + "," + y2 +             // Arc goes to to (x2,y2)
			            " Z";                       // Close path back to (cx,cy)

					var pathOptions = {
						d: d,
						serie: serie,
						value: value,
						pos: pos
					};

					wesCountry.charts.setElementInfo(element, pathOptions);

					var colour = options.getElementColour(options, options.series[j], j);

					var path = g.path(pathOptions)
					.event("onmouseover", onmouseover)
					.event("onmouseout", onmouseout)
					.event("onclick", onclick)
			    .style(String.format("fill: {0}", colour));

					if (donut) {
						g.circle({
							cx: cx,
							cy: cy,
							r: donutRadius,
						})
						.className('hole')
						.style(String.format("fill: {0}", holeColour));
					}

			    // Value on bar
					if (options.valueOnItem.show == true) {
						g.text({
							x: xMiddle,
							y: yMiddle,
							value: value
						}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
							options.valueOnItem["font-colour"],
							options.valueOnItem["font-family"],
							options.valueOnItem["font-size"]));
					}

			    startangle = endangle;
				}
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;

		// Max value & min value
		var maxAndMinValues = wesCountry.charts.getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = maxAndMinValues.valueLength != 0 ? (innerWidth - yAxisMargin) / maxAndMinValues.valueLength : 0;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth / options.series.length;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}
};
////////////////////////////////////////////////////////////////////////////////
//                                  POLAR CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.polarChart = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// Axis

		var radius = Math.min(sizes.innerWidth - 2 * sizes.yAxisMargin, sizes.innerHeight - 2 * sizes.xAxisMargin) / 2;
		var numberOfVertices = sizes.maxValueLength;
		var cx = sizes.width / 2;
		var cy = sizes.height / 2;

		// Vertex calculation

		var vertices = [];

		for (var i = 0; i < numberOfVertices; i++) {
			vertices.push({
				x: cx + radius * Math.cos((2 * Math.PI * i) / numberOfVertices - Math.PI / 2),
				y: cy + radius * Math.sin((2 * Math.PI * i) / numberOfVertices - Math.PI / 2)
			});
		}

		// Radius

		for (var i = 0; i < numberOfVertices; i++) {
			var vertex = vertices[i];

		  	g.line({
		  		x1: cx,
		  		y1: cy,
		  		x2: vertex.x,
		  		y2: vertex.y
		  	}).style(String.format("stroke: {0};", options.yAxis.tickColour));
		}

		// Label

		for (var i = 0; i < numberOfVertices; i++) {
			var x = cx + (radius + sizes.xAxisMargin) * Math.cos((2 * Math.PI * i) / numberOfVertices - Math.PI / 2);
			var y = cy + (radius + sizes.yAxisMargin) * Math.sin((2 * Math.PI * i) / numberOfVertices - Math.PI / 2);

			var value = options.xAxis.values[i] ? options.xAxis.values[i] : "";

		  	g.text({
				x: x,
				y: y,
				value: value
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
				options.xAxis["font-colour"],
				options.xAxis["font-family"],
				options.xAxis["font-size"]));
		}

		// Polygon sides

		var maxValue = sizes.maxValue;
		var minValue = sizes.minValue;

		var pow = 5;
		maxValue =  Math.ceil(maxValue / pow) * pow;
		minValue =  Math.floor(minValue / pow) * pow;

		//var ticksY = maxValue - minValue;

		//var numberOfAxis = 5;
		var ticksY = 5;
		//maxValue = numberOfAxis.max;

		var radiusInc = radius / ticksY;
		var tickInc = (maxValue - minValue) / ticksY;

		for (var i = 0; i <= ticksY; i++) {
			var polygonVertices = [];
			var polygonRadius = radiusInc * i;

			// Label (Vertical Number)

			g.text({
				x: cx - sizes.xAxisMargin / 2,
				y: cy - polygonRadius,
				value: minValue + i * tickInc
			}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: end;dominant-baseline: middle",
				options.yAxis["font-colour"],
				options.yAxis["font-family"],
				options.yAxis["font-size"]));

			// Polygon vertex calculation

			for (var j = 0; j < numberOfVertices; j++) {
				polygonVertices.push({
					x: cx + polygonRadius * Math.cos((2 * Math.PI * j) / numberOfVertices - Math.PI / 2),
					y: cy + polygonRadius * Math.sin((2 * Math.PI * j) / numberOfVertices - Math.PI / 2)
				});
			}

			// Polygon side drawing

			for (var j = 0; j < numberOfVertices; j++) {
				var vertex = polygonVertices[j];
				var vertexPrev = j == 0 ? polygonVertices[numberOfVertices - 1] : polygonVertices[j - 1];

			  	g.line({
			  		x1: vertexPrev.x,
			  		y1: vertexPrev.y,
			  		x2: vertex.x,
			  		y2: vertex.y
			  	}).style(String.format("stroke: {0};", options.yAxis.tickColour));
			}
		}

		// Values

		var zeroRadius = Math.abs(minValue / (maxValue - minValue)) * radius;
		var length = options.series.length;
		var polygonVertices = [];

		// Vertex calculation

		for (var i = 0; i < length; i++) {

			polygonVertices[i] = new Array();

			for (j = 0; j < numberOfVertices; j++) {
				var value = options.series[i].values[j];

				if (!value) {
					polygonVertices[i].push(null);

					continue;
				}
					//value = 0;

				if (value < 0) {
					//var total = maxValue - minValue;
					//var amount = Math.abs(value) / total;
					//var valueRadius = (amount * radius);
					var valueRadius = zeroRadius - Math.abs(value / minValue) * zeroRadius;
				}
				else {
					var valueRadius = (value / maxValue) * (radius - zeroRadius) + zeroRadius;
				}

				var x = cx + valueRadius * Math.cos((2 * Math.PI * j) / numberOfVertices - Math.PI / 2);
				var y = cy + valueRadius * Math.sin((2 * Math.PI * j) / numberOfVertices - Math.PI / 2);

				polygonVertices[i].push({
					x: x,
					y: y
				});
			}
		}

		// Events

		var setLineWidth = function(element, stroke) {
			var className = element.getAttribute("class");
			var lines = element.parentNode.querySelectorAll("line." + className);
			var length = lines.length;

			for (var k = 0; k < length; k++) {
				lines[k].setAttribute("stroke-width", stroke)
			}
		};

		var onmouseover = function(event) {
			this.setAttribute("r", 8);
			setLineWidth(this, 2);
			options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
		};

		var onmouseout = function(event) {
			this.setAttribute("r", 5);
			setLineWidth(this, 1);
			options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
		};

		var onclick = function(event) {
			this.setAttribute("r", 5);
			setLineWidth(this, 1);
			options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
		};

		// Polygon drawing

		for (var i = 0; i < length; i++) {
			var lineId = "l" + wesCountry.charts.guid();

      var pathD = "";

			var lastNotNull = numberOfVertices - 1;

			while (!polygonVertices[i][lastNotNull] && lastNotNull > 0)
				lastNotNull--;

			var vertexPrev = polygonVertices[i][lastNotNull];

			for (var j = 0; j < numberOfVertices; j++) {
				var vertex = polygonVertices[i][j];

				var element = options.series[i];
				var value = element.values[j];
				var id = element.id;
				var serie = element.name;
				var pos = options.xAxis.values[j];

				if (!vertex)
					continue;

				var colour = options.getElementColour(options, options.series[i], i);

				if (options.vertex.show) {

					var circleOptions = {
						cx: vertex.x,
						cy: vertex.y,
						r: 5,
						id: id,
						serie: serie,
						value: value,
						pos: pos,
						"class": lineId
					};

					wesCountry.charts.setElementInfo(element, circleOptions);

					g.circle(circleOptions).style(String.format("fill: {0}", colour))
					.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
				}

				var lineOptions = {
					x1: vertexPrev.x,
					y1: vertexPrev.y,
					x2: vertex.x,
					y2: vertex.y,
					"class": lineId
				};

				wesCountry.charts.setElementInfo(element, lineOptions);

				g.line(lineOptions).style(String.format("stroke: {0};", colour));

        pathD += String.format("{0}{1} {2}", pathD == "" ? "M" : "L", vertex.x, vertex.y);

				vertexPrev = vertex;
			}

			if (pathD != "") {
				var firstNotNull = 0;

				while (!polygonVertices[i][firstNotNull] && firstNotNull < numberOfVertices - 1)
					firstNotNull++;

	      var vertex = polygonVertices[i][firstNotNull];

				if (vertex) {
	        pathD += String.format(" L{0} {1} Z", vertex.x, vertex.y);

	        g.path({
	            d: pathD
	        }).style(String.format("stroke: {0}; fill: {0}; opacity: 0.5", colour));
				}
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;

		// Max value & min value
		var maxAndMinValues = wesCountry.charts.getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min > 0 ? 0 : maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = maxAndMinValues.valueLength != 0 ? (innerWidth - yAxisMargin) / maxAndMinValues.valueLength : 0;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth / options.series.length;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}
};
////////////////////////////////////////////////////////////////////////////////
//                                SCATTER PLOT
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.scatterPlot = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// X Axis & Y Axis
		wesCountry.charts.setAxisY(g, sizes, options);
		var sizesX = setAxisX(g, sizes, options);

		// Values
		var length = options.series.length;

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var maxWidth = sizes.innerWidth - sizes.yAxisMargin;

		var zeroPos = 0;

		if (sizes.minValue <= 0 && sizes.maxValue - sizes.minValue != 0)
			zeroPos = sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;

		var zeroPosX = 0;

		if (sizesX.minValue <= 0)
			zeroPosX = sizesX.xTickWidth * Math.abs(sizesX.minValue);

		// Events

		var onmouseover = function(event) {
			this.colour = this.style.fill;
			
			if (options.showOverColour && options.overColour && options.overColour !== 'none') {
				this.style.fill = options.overColour;
			}

			options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
		};

		var onmouseout = function(event) {
			this.style.fill = this.colour;
			options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
		};

		var onclick = function(event) {
			this.style.fill = this.colour;
			options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
		};

		var maxRadius = options.sizeByValueMaxRadius * maxWidth / 100;
		var minRadius = options.sizeByValueMinRadius * maxWidth / 100;
		var radiusRange = maxRadius - minRadius;

		for (var i = 0; i < length; i++) {
			var values = options.series[i].values;

			values.sort(function(a, b) {
				var value1x = a[0] ? a[0] : 0;
				var value1y = a[1] ? a[1] : 0;
				var value2x = b[0] ? b[0] : 0;
				var value2y = b[1] ? b[1] : 0;
				return Math.abs(value2x * value2y) - Math.abs(value1x * value1y);
			});

			var valueLength = values.length;

			// Max and min
			var maxValue = 1;
			var minValue = 1;
			var range = 1;

			if (valueLength > 0) {
				var maxX = values[0][0] ? values[0][0] : 1;
				var maxY = values[0][1] ? values[0][1] : 1;
				maxValue = Math.abs(maxX * maxY);

				var minX = values[valueLength - 1][0] ? values[valueLength - 1][0] : 1;
				var minY = values[valueLength - 1][1] ? values[valueLength - 1][1] : 1;
				minValue = Math.abs(minX * minY);

				range = maxValue - minValue;
			}

			var minX = Number.MAX_VALUE;
			var maxX = 0;

			for (var j = 0; j < valueLength; j++) {
				var valueX = values[j][0] ? values[j][0] : 0;

				if (!valueX)
					valueX = 0;

				var valueY = values[j][1] ? values[j][1] : 0;

				if (!valueY)
					valueY = 0;

				if (valueX > maxX)
					maxX = valueX;

				if (valueX < minX)
					minX = valueX;
			}

			// Fit line
			if (options.showFitLine.show && valueLength > 1) {
				var line = getFitLine(values);

				// y = a + bx

				// First point
				var firstPointX = minX;
				var lastPointX = maxX;

				var firstPointY = line.a + line.b * firstPointX;
				var lastPointY = line.a + line.b * lastPointX;

				var pointA = transformPoint(sizes, sizesX, zeroPosX, zeroPos, maxWidth, maxHeight, firstPointX, firstPointY);
				var pointB = transformPoint(sizes, sizesX, zeroPosX, zeroPos, maxWidth, maxHeight, lastPointX, lastPointY);

				g.line({
					x1: pointA.x,
					x2: pointB.x,
					y1: pointA.y,
					y2: pointB.y,
					"stroke-width": options.showFitLine.stroke
				}).style(String.format("stroke: {0}", options.showFitLine.colour));
			}

			for (var j = 0; j < valueLength; j++) {
				var valueX = values[j][0] ? values[j][0] : 0;

				var element = options.series[i];
				var value = element.values[j];
				var id = element.id;
				var serie = element.name;
				var pos = valueX;

				var extra = values[j][2];

				if (!valueX)
					valueX = 0;

				var valueY = values[j][1] ? values[j][1] : 0;

				if (!valueY)
					valueY = 0;

				// Circle radius
				var radius = minRadius;

				// Circle radius by size
				if (options.sizeByValue === true) {
					var rValue = valueX * valueY != 0 ? Math.abs(valueX * valueY) : 1;
					radius = (((rValue - minValue) * radiusRange) / range) + minRadius;
				}

				var point = transformPoint(sizes, sizesX, zeroPosX, zeroPos, maxWidth, maxHeight, valueX, valueY);
				var xPos = point.x;
				var yPos = point.y;

				var colour = options.getElementColour(options, options.series[i], i, j);

				var circleOptions = {
					cx: xPos,
					cy: yPos,
					r: radius,
					id: id,
					serie: serie,
					value: value,
					pos: pos
				};

				wesCountry.charts.setElementInfo(element, circleOptions);

				if (extra)
					wesCountry.charts.setElementInfo(extra, circleOptions);

				g.circle(circleOptions).style(String.format("fill: {0}", colour))
				.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function transformPoint(sizes, sizesX, zeroPosX, zeroPos, maxWidth, maxHeight, valueX, valueY) {
		var xPos = sizes.marginLeft + sizes.yAxisMargin
						+ zeroPosX
						+ (sizesX.maxValue - sizesX.minValue == 0 ? 0 :
							(valueX - sizesX.minValue) / (sizesX.maxValue - sizesX.minValue))
						* maxWidth;

		var yPos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
						+ zeroPos
						- (sizes.maxValue - sizes.minValue == 0 ? 1 :
							(valueY - sizes.minValue) / (sizes.maxValue - sizes.minValue))
						* maxHeight;

		return {
			x: xPos,
			y: yPos
		};
	}

	function getFitLine(values) {
		var length = values.length;

		var sumX = 0;
		var sumY = 0;
		var sumXY = 0;
		var sumXX = 0;
		var sumYY = 0;

		for (var i = 0; i < length; i++) {
			var value = values[i];
			var x = 0;
			var y = 0;

			if (value.length > 0)
				x = value[0];

			if (value.length > 1)
				y = value[1];

			sumX += x;
			sumY += y;
			sumXY += x * y;
			sumXX += x * x;
			sumYY += y * y;
		}

		var divisor = length * sumXX - sumX * sumX;

		var a = (sumY * sumXX - sumX * sumXY) / divisor;
		var b = (length * sumXY - sumX * sumY) / divisor;

		return {
			a: a,
			b: b
		}
	}

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;

		// Max value & min value
		var maxAndMinValues = wesCountry.charts.getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = (innerWidth - yAxisMargin) / maxAndMinValues.valueLength;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth / options.series.length;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}

	// For scatter plot
	function setAxisX(container, sizes, options) {
		// X Axis

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var divisor = sizes.maxValue - sizes.minValue != 0 ? sizes.maxValue - sizes.minValue : 1;
		var zeroPos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
					+ sizes.minValue / divisor * maxHeight;

		container.line({
			x1: sizes.marginLeft + sizes.yAxisMargin,
			x2: sizes.marginLeft + sizes.innerWidth,
			y1: zeroPos,
			y2: zeroPos
		}).style(String.format("stroke: {0}", options.xAxis.colour));

		// X Axis Ticks

		var maxAndMinValues = getMaxAndMinValuesAxisX(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		var ticksX = (maxValue - minValue) / maxAndMinValues.inc;

		var xTickWidth = (sizes.innerWidth - sizes.yAxisMargin) / (ticksX > 0 ? ticksX : 1);
		var incX = maxAndMinValues.inc;

		var length = ticksX + 1;

		for (var i = 0; i < length; i++) {
			// Line

			var xPos = sizes.marginLeft + sizes.yAxisMargin + xTickWidth * i;

			container.line({
				x1: xPos,
				x2: xPos,
				y1: sizes.marginTop,
				y2: sizes.innerHeight + sizes.marginTop - sizes.xAxisMargin
			}).style(String.format("stroke: {0}", options.xAxis.tickColour));

			// Label

			var value = minValue + incX * i;

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

		return {
			"maxAndMinValues": maxAndMinValues,
			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksX: ticksX,
			xTickWidth: xTickWidth,
			incX: incX,
		};
	}

	// For scatter plot
	function getMaxAndMinValuesAxisX(options) {
		var maxValue = 0, minValue = Number.MAX_VALUE;

		var length = options.series.length;
		var valueLength = null;
		var value = null;

		for (var i = 0; i < length; i++) {
			valueLength = options.series[i].values.length;

			for (var j = 0; j < valueLength; j++) {
				value = options.series[i].values[j][0] ? options.series[i].values[j][0] : 0;

				if (value > maxValue)
					maxValue = value;

				if (value < minValue)
					minValue = value;
			}
		}

		var maxAndMinValues = wesCountry.charts.getNearestNumber(minValue, maxValue, options, options.xAxis.maxValue, options.xAxis.pow, options.xAxis.tickNumber);

		return {
			max: maxAndMinValues.max,
			min: maxAndMinValues.min,
			inc: maxAndMinValues.inc
		};
	}
};
NodeList.prototype.indexOf = function (element) {
	for(var i=0;i<this.length;i++) {
		if(this[i] == element)
			return i;
	} return -1;
};

////////////////////////////////////////////////////////////////////////////////
//                                  TABLE
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.table = function(options) {
	options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

	var table = document.createElement('table');
	table.className = 'wesCountry pages';

	var thead = document.createElement('thead');
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	var tr = document.createElement('tr');
	thead.appendChild(tr);

	var th = document.createElement('th');
	th.innerHTML = 'Country';
	tr.appendChild(th);

	var th = document.createElement('th');
	th.innerHTML = 'Time';
	tr.appendChild(th);

	var th = document.createElement('th');
	th.innerHTML = 'Value';
	tr.appendChild(th);

	for (var i = 0; i < options.series.length; i++) {
		var country = options.series[i].name;

		for (var j = 0; j < options.xAxis.values.length; j++) {
			var value = options.series[i].values[j];
			var time = options.xAxis.values[j];

			var tr = document.createElement('tr');
			tbody.appendChild(tr);

			var td = document.createElement('td');
			td.innerHTML = country;
			tr.appendChild(td);

			var td = document.createElement('td');
			td.innerHTML = time;
			tr.appendChild(td);

			var td = document.createElement('td');
			td.innerHTML = value;
			tr.appendChild(td);
		}
	}

	return {
		render: function() {
			return table;
		}
	};
}

////////////////////////////////////////////////////////////////////////////////
//                                  CHART
////////////////////////////////////////////////////////////////////////////////

function getCountriesForMap(options) {
	var countryData = [];
	var countries = [];

	for (var i = options.series.length - 1; i >= 0; i--) {
		var countryName = options.series[i].name;
		var countryId = options.series[i].id ? options.series[i].id : countryName;

		if (countries.indexOf(countryId) != -1)
			continue;

		countries.push(countryId);

		for (var j = 0; j < options.xAxis.values.length; j++) {
			var value = options.series[i].values[j];
			var time = options.xAxis.values[j];

			if (value) {
				countryData.push({
					code: countryId,
					value: value,
					time: time
				});

				break;
			}
		}
	}

	return countryData;
}

wesCountry.charts.chart = function (options) {
	var downloadFormats = ['JSON', 'XML', 'CSV'];
	var defaultOptions = {
		"download": false,
		"downloadFormats": downloadFormats
	}

	var container;
	var body;
	var chart;

	container = typeof options.container !== "string" ? options.container : undefined;
	options.container = typeof options.container === "string" ? options.container : wesCountry.charts.defaultOptions.container;

	if(container === undefined)
		container = document.querySelector(options.container);

	if (!container)
		container = document.body;

	return render(container);

	function render(container) {

		if (!options.width && container.offsetWidth > 0 )
			options.width = container.offsetWidth;

		if (!options.height && container.offsetHeight > 0 )
			options.height = container.offsetHeight;

		var dOptions = wesCountry.clone(wesCountry.charts.defaultOptions);
		dOptions = wesCountry.addOptions(dOptions, defaultOptions);
		options = wesCountry.mergeOptionsAndDefaultOptions(options, dOptions);

		// Height

		//var height = options.height;
		var height = wesCountry.getFullHeight(container);

		// Title

		if (options.title != '') {
			var title = document.createElement('p');
			title.className = 'wesCountry-title';
			title.innerHTML = options.title;
			container.appendChild(title);

			height -= wesCountry.getFullHeight(title);
		}

		// Body (graph)

		body = document.createElement('div');
		body.className = 'wesCountry-body';
		container.appendChild(body);

		var footer = document.createElement('div');
		footer.className = 'wesCountry-footer';

		var isFooted = false;

		// Foot

		if (options.foot != '') {
			container.appendChild(footer);

			var foot = document.createElement('p');
			foot.className = 'wesCountry-foot';
			foot.innerHTML = options.foot;
			footer.appendChild(foot);

			isFooted = true;
		}

		// Download

		var downloadButtons = null;

		if (options.download) {
			if (!options.foot)
				container.appendChild(footer);

			downloadButtons = createDownload(footer, options, downloadFormats);

			isFooted = true;
		}

		if  (isFooted)
			height -= wesCountry.getFullHeight(footer);

		// Chart

		if (isNaN(height) || height <= 0) {
			height = options.height;
		}

		options.height = height;

		body.style.height = height + 'px';

		//chart = getChart(options, body);

		// Append chart

		renderChart();

		if (downloadButtons)
			linkDownloadButtons(downloadButtons, chart, options)

		// Resize
		if (window.attachEvent)
			window.attachEvent('resize', resize);
		else
			window.addEventListener('resize', resize, false);

		return chart;
	}

	function resize() {
		renderChart();
	}

	function renderChart() {
		body.innerHTML = '';

		options.width = options.width ? options.width : container.offsetWidth;

		if (container.offsetWidth == 0 && options.parentContainer) {
			parentContainer = document.getElementById(options.parentContainer);

			if (parentContainer && parentContainer.offsetWidth)
				options.width = parentContainer.offsetWidth;
		}

		chart = getChart(options, body);

		if (chart && chart.render) {
			body.appendChild(chart.render());
			// table pagination
			wesCountry.table.pages.apply(15);
		}

		return chart;
	}
}

function linkDownloadButtons(downloadButtons, chart, options) {
	var data = getDataToDownload(chart, options);

	for (var i = 0; i < downloadButtons.length; i++) {
		var button = downloadButtons[i];
		var format = button.format;
		var datum = data[format];

		var dataURL = generateDownloadLinkData(datum, format);
		button.button.href = dataURL;
	}
}

function generateDownloadLinkData(data, format) {
  var href = "";

  try{
    var blob = new Blob( [data], {type : format});
    href = URL.createObjectURL(blob);
  }
  catch(e){
      // TypeError old chrome and FF
      window.BlobBuilder = window.BlobBuilder ||
                           window.WebKitBlobBuilder ||
                           window.MozBlobBuilder ||
                           window.MSBlobBuilder;
      if(e.name == 'TypeError' && window.BlobBuilder){
          var bb = new BlobBuilder();
          bb.append([data]);
          var blob = bb.getBlob(format);
          href = URL.createObjectURL(blob);
      }
      else if(e.name == "InvalidStateError"){
          // InvalidStateError (tested on FF13 WinXP)
          var blob = new Blob( [data], {type : format});
          href = URL.createObjectURL(blob);
      }
      else {
          // We're screwed, blob constructor unsupported entirely
          data = encodeURIComponent(data)
          href = String.format("data:text/{0};charset=utf-8,{1}", format, data);
      }
  }

  return href;
}

function createDownload(container, options, downloadFormats) {
		var buttons = [];

		for (var i = 0; i < downloadFormats.length; i++) {
			var format = downloadFormats[i];

			if (options.downloadFormats.indexOf(format) == -1)
			 	continue;

			var a = document.createElement('a');
			a.className = String.format('wesCountry-download format-{0}', format);
			a.innerHTML = format;
			a.download = String.format("data.{0}", format);
			a.target = "_blank";

			container.appendChild(a);

			buttons.push({
				format: format,
				button: a
			});
		}

		return buttons;
}

function getDataToDownload(chart, options) {
	var jsonData = getJSON(chart, options);
	var xmlData = getXML(jsonData);
	var csvData = getCSV(jsonData);

	return {
		JSON: JSON.stringify(jsonData),
		XML: xmlData,
		CSV: csvData
	}
}

function getJSON(chart, options) {
	var chartType = options.chartType ? options.chartType.toLowerCase() : "bar";

	var elements = [];

	if (chartType == "map") {
		var countries = options.countries ? options.countries : [];

		for (var i = 0; i < countries.length; i++) {
			var country = countries[i];
			var value = countries[i].value;
			var countryInfo = chart.getCountryInfo(country.code);

			if (!countryInfo)
				continue;

			countryInfo.value = value;

			elements.push(countryInfo);
		}
	}
	else if (chartType == "scatter") {
		var moment1 = options.xAxis.values[0] ? options.xAxis.values[0] : "Moment 1";
		var moment2 = options.xAxis.values[1] ? options.xAxis.values[1] : "Moment 2";

		for (var i = 0; i < options.series.length; i++) {
			var serie = options.series[i].name;
			var values = options.series[i].values;
			for (var j = 0; j < values.length; j++) {
				var value1 = values[0];
				var value2 = values[1];

				var data = {
					"serie": serie
				};

				data[moment1] = value1;
				data[moment2] = value2;

				elements.push(data);
			}
		}
	}
	else {
		for (var i = 0; i < options.series.length; i++) {
			var serie = options.series[i].name;
			var values = options.series[i].values;
			for (var j = 0; j < options.xAxis.values.length; j++) {
				var value = values[j] ? values[j] : "";
				var moment = options.xAxis.values[j];

				elements.push({
					"serie": serie,
					"moment": moment,
					"value": value
				});
			}
		}
	}

	return elements;
}

function getXML(json) {
  var data = '';

	for (var i = 0; i < json.length; i++) {
		var element = json[i];
		var elementData = '';

		for (var key in element) {
			var value = element[key];
			elementData += String.format('<{0}>{1}</{0}>', key, value);
		}

		data += String.format('<element>{0}</element>', elementData);
	}

	return String.format('<?xml version="1.0" encoding="UTF-8" ?><elements>{0}</elements>', data);
}

function getCSV(json) {
	var array = typeof json != 'object' ? JSON.parse(json) : json;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';

		for (var index in array[i]) {
      if (line != '')
				line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function getChart(options, container) {
	var chartType = options.chartType ? options.chartType.toLowerCase() : "bar";

	var chart = null;

	switch(chartType) {
		case "bar":
			chart = wesCountry.charts.barChart(options);
			break;
		case "line":
			chart = wesCountry.charts.lineChart(options);
			break;
		case "pie":
			chart = wesCountry.charts.pieChart(options);
			break;
		case "donut":
			chart = wesCountry.charts.donutChart(options);
			break;
		case "area":
			chart = wesCountry.charts.areaChart(options);
			break;
		case "scatter":
			chart = wesCountry.charts.scatterPlot(options);
			break;
		case "polar":
			chart = wesCountry.charts.polarChart(options);
			break;
		case 'table':
			chart = wesCountry.charts.table(options);
			break;
		case 'stacked':
			chart = wesCountry.charts.stackedChart(options);
			break;
		case 'ranking':
			chart = wesCountry.charts.rankingChart(options);
			break;
		case 'map':
			var innerContainer = document.createElement('div');
			innerContainer.id = String.format("map-wrapper-{0}", wesCountry.guid());
			innerContainer.style.height = options.height + 'px';

			//container = document.querySelector(options.container);
			container.appendChild(innerContainer);

			options.container = String.format("#{0}", innerContainer.id);
			options.countries = options.countries ? options.countries : getCountriesForMap(options);

			chart = wesCountry.maps.createMap(options);

			if (chart)
				chart.container = innerContainer;

			return chart;
	}

	chart.container = container;
	return chart;
}

////////////////////////////////////////////////////////////////////////////////
//                                MULTI CHART
////////////////////////////////////////////////////////////////////////////////
/*var optionsSave = [];
var pushIndex = optionsSave.length;
wesCountry.charts.multiChartRemoveData = function (from, numberOf) {
	optionsSave.splice(from, numberOf);
};

wesCountry.charts.setPushIndex = function (index) {
	if(index === "length") {
		pushIndex = optionsSave.length;
	} else {
		pushIndex = index;
	}
};
*/
wesCountry.charts.multiChart = function (options) {
	var defaultOptions = {
		chartType: ['line']
	}

	options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

	if (typeof options.chartType === "string") {
		return [wesCountry.charts.chart(options)];
	}

	var chartTypes = options.chartType;
	var container = document.querySelector(options.container);

	var containerHeight = container.offsetHeight;

	var chartSelector = document.createElement('div');
	chartSelector.className = "chart-selector";
	container.appendChild(chartSelector);

	var buttons = createChartSelector(chartSelector);

	var chartContainer = document.createElement('div');
	chartContainer.id = String.format("chart-container-{0}", wesCountry.guid());
	chartContainer.className = 'chart-container';

	containerHeight = containerHeight > 0 ? containerHeight : 500;

	chartContainer.style.height = (containerHeight - chartSelector.offsetHeight) + 'px';
	container.appendChild(chartContainer);

	return createCharts(chartContainer, buttons);

	function createChartSelector(container) {
		var buttons = [];

		var div = document.createElement('div');
		container.appendChild(div);

		var ul = document.createElement('ul');
		div.appendChild(ul);

		var length = chartTypes.length;

		for (var i = 0; i < length; i++) {
			var type = chartTypes[i];

			var li = document.createElement('li');
			li.setAttribute('type', type);
			//li.chart = null;
			li.className = i == 0 ? 'button-active' : 'button-inactive';
			ul.appendChild(li);

			var a = document.createElement('a');
			a.setAttribute('type', type);
			a.innerHTML = String.format("<span>{0}</span>", type);
			li.appendChild(a);

			a.onclick = function() {
				var ul = this.parentNode.parentNode;

				var buttons = ul.childNodes;

				var length = buttons.length;

				for (var i = 0; i < length; i++) {
					var button = buttons[i];

					// Set button
					button.className = 'button-inactive';

					// Set chart
					button.chart.style.display = 'none';
				}

				// Set button
				var button = this.parentNode;
				button.className = 'button-active';

				// Set chart
				button.chart.style.display = 'block';
			}

			buttons.push(li);
		}

		return buttons;
	}

	function createCharts(container) {
		var length = chartTypes.length;

		var charts = [];

		for (var i = 0; i < length; i++) {
			var type = chartTypes[i];

			var id = String.format("chart-{0}", wesCountry.guid());

			var chartContainer = document.createElement('div');
			chartContainer.id = id;
			var height = wesCountry.getFullHeight(container);
			height = isNaN(height) ? options.height : height;
			chartContainer.style.height = height + 'px';
			container.appendChild(chartContainer);

			buttons[i].chart = chartContainer;

			options.parentContainer = container.id;

			var chartOptions = wesCountry.clone(options);
			chartOptions.chartType = type;
			chartOptions.container = String.format("#{0}", id);

			var chart = wesCountry.charts.chart(chartOptions);

			charts.push(chart);

			// Is set after rendering the chart (if not height is not obteined properly)
			chartContainer.style.display = (i == 0) ? 'block' : 'none';
		}

		return charts;
	}
};
////////////////////////////////////////////////////////////////////////////////
//                               STACKED CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.stackedChart = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
		options.yAxis["from-zero"] = true;

		if (options.sortSeries)
			options.series = wesCountry.charts.sortSeries(options.series);

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		// Size and margins (%)
		var sizes = getSizes(svg, options);

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// X Axis & Y Axis
		wesCountry.charts.setAxisY(g, sizes, options);
		wesCountry.charts.setAxisX(g, sizes, options);

		// Values
		var length = sizes.maxValueLength;
		var numberOfSeries = options.series.length;

		var barMargin = options.barMargin * sizes.xTickWidth / 100;
		var groupMargin = options.groupMargin * sizes.xTickWidth / 100;

		var barWidth = sizes.barWidth;

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
		var minValuePos = sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;

		// Values

		for (var i = 0; i < length; i++) {

			var auxPositivePos = minValuePos;
			var auxNegativePos = minValuePos;

			for (var j = 0; j < numberOfSeries; j++) {
				var element = options.series[j];
				var serie = element.name;
				var id = element.id;
				var value = element.values[i];
				var url = element.urls ? element.urls[i] : "";
				var pos = options.xAxis.values[j];

				if (!value)
					value = 0;

				var xPos = sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin * (2 * i + 1) + sizes.barMargin
						+ sizes.xTickWidth * i;

				var yPos = getYPos(value, sizes, value >= 0 ? auxPositivePos : auxNegativePos, maxHeight);

				var height = (Math.abs(value) / (sizes.maxValue - sizes.minValue))
						* maxHeight;

				// Accumulative initial pos
				if (value >= 0)
					auxPositivePos -= height;
				else
					auxNegativePos += height;

				var rectangleOptions = {
					x: xPos,
					y: yPos,
					width: barWidth,
					height: height,
					id: id,
					serie: serie,
					value: value,
					pos: pos
				};

				wesCountry.charts.setElementInfo(element, rectangleOptions);

				var rectangleStyle = String.format("fill: {0}", options.serieColours[j]);

				// Events

				var selectBar = function(element) {
					var selectedBars = document.querySelectorAll(options.container + ' rect[selected]');

					for (var i = 0; i < selectedBars.length; i++)
						unselectBar(selectedBars[i]);

					var rect = element.querySelector('rect');

					rect.colour = rect.style.fill;
					
					if (options.showOverColour && options.overColour && options.overColour !== 'none') {
						rect.style.fill = options.overColour;
					}
					
					rect.setAttribute("selected", "selected");
				};

				var onmouseover = function(event) {
					selectBar(this);

					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				};

				var unselectBar = function(element) {
					var rect = element.querySelector('rect');

					if (rect)
						rect.style.fill = rect.colour;
				};

				var onmouseout = function(event) {
					unselectBar(this);
					options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
				};

				var onclick = function(event) {
					this.style.fill = this.colour;
					options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
				};

				// Node for element and text
				var nodeOptions = {
					id: id,
					serie: serie,
					value: value,
					pos: pos
				};

				wesCountry.charts.setElementInfo(element, nodeOptions);

				var node = g.g(nodeOptions);

				var r = null;

				if (url && url != "") {
					var a = node.a({}, url ? url : "")
					r = a.rectangle(rectangleOptions);
				}
				else {
					r = node.rectangle(rectangleOptions);
				}

				r.style(rectangleStyle).className(serie);

				node.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick)
				.event("selectBar", function() {
					selectBar(this);
				}).event("unselectBar", function() {
					unselectBar(this);
				});

				// Value on bar
				if (options.valueOnItem.show == true && value != 0) {
					node.text({
						x: xPos + barWidth / 2,
						y: yPos + height / 2,
						value: value.toFixed(2)
					}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
						options.valueOnItem["font-colour"],
						options.valueOnItem["font-family"],
						options.valueOnItem["font-size"]))
						.className("ranking-item-name");
				}
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function getYPos(value, sizes, minValuePos, maxHeight) {
		if (value >= 0)	{
			return sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
					+ minValuePos
					- (value / (sizes.maxValue - sizes.minValue))
					* maxHeight;
		}
		else {
			return sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
					+ minValuePos
		}
	}

	function getSizes(svg, options) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;
		var maxBarWidth = options.maxBarWidth * innerWidth / 100;

		// Max value & min value
		var maxAndMinValues = getMaxAndMinValuesAxisY(options);
		var maxValue = maxAndMinValues.max;
		var minValue = maxAndMinValues.min > 0 ? 0 : maxAndMinValues.min;
		var maxValueLength = maxAndMinValues.valueLength;

		// If max and min Value are the same we set difference
		if (minValue == maxValue) {
			minValue = minValue >= 0 ? 0 : minValue - 2;
			maxValue += 2;
		}

		var ticksY = (maxValue - minValue) / maxAndMinValues.inc;
		var yTickHeight = ticksY != 0 ? (innerHeight - xAxisMargin) / ticksY : 0;
		var xTickWidth = maxValueLength != 0 ? (innerWidth - yAxisMargin) / maxValueLength : 0;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth;
		var barMargin = options.barMargin * barWidth / 100;
		barWidth -= 2 * barMargin;

		if (barWidth > maxBarWidth) {
			var diff = barWidth - maxBarWidth;
			barMargin += diff / 2;
			barWidth = maxBarWidth;
		}

		var valueInc = ticksY != 0 ? (maxValue - minValue) / ticksY : 0;

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			maxValue: maxValue,
			minValue: minValue,
			maxValueLength: maxValueLength,

			ticksY: ticksY,
			yTickHeight: yTickHeight,
			xTickWidth: xTickWidth,
			valueInc: valueInc,

			barMargin: barMargin,
			groupMargin: groupMargin,
			barWidth: barWidth,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}

	function getMaxAndMinValuesAxisY(options) {
		var maxValue = 0, minValue = Number.MAX_VALUE;

		var length = options.series.length;
		var valueLength = null;
		var value = null;
		var maxValueLength = 0;

		for (var i = 0; i < length; i++) {
			valueLength = options.series[i].values.length;

			if (valueLength > maxValueLength)
				maxValueLength = valueLength;
		}

		for (var i = 0; i < maxValueLength; i++) {

			var positiveSum = 0;
			var negativeSum = 0;

			for (var j = 0; j < length; j++) {
				var serie = options.series[j];
				value = serie.values && serie.values[i] ? serie.values[i] : 0;

				if (value >= 0)
					positiveSum += value;
				else
					negativeSum += value;
			}

			if (positiveSum > maxValue)
				maxValue = positiveSum;

			if (negativeSum < minValue)
				minValue = negativeSum;
		}

		if (options.yAxis["from-zero"] === true && minValue > 0)
			minValue = 0;

		var maxAndMinValues = wesCountry.charts.getNearestNumber(minValue, maxValue, options);

		return {
			max: maxAndMinValues.max,
			min: maxAndMinValues.min,
			valueLength: maxValueLength,
			length: length,
			inc: maxAndMinValues.inc
		};
	}
};
////////////////////////////////////////////////////////////////////////////////
//                                RANKING CHART
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.rankingChart = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
		options.yAxis["from-zero"] = true;

		// SVG creation
		var svg = wesCountry.charts.getSVG(options);

		var groups = splitIntoGroups(options.series);
		var length = groups.length;

		// Size and margins (%)
		var sizes = getSizes(svg, options, groups);

		// Direction
		if (options.rankingDirection != "lowerToHigher")
			groups.reverse();

		// Labels
		var firstLabel = options.rankingDirection ==
			"lowerToHigher" ? options.rankingLower : options.rankingHigher;

		var lastLabel = options.rankingDirection ==
			"lowerToHigher" ? options.rankingHigher : options.rankingLower;

		var labels = [];

		for (var i = 0; i < length; i++)
			if (i == 0 && length > 0)
				labels.push(firstLabel);
			else if (i == length -1 && length > 0)
				labels.push(lastLabel);
			else
				labels.push("");

		options.xAxis.values = labels;

		var g = svg.g();

		// Background

		wesCountry.charts.setBackground(g, sizes, options);

		// X Axis & Y Axis
		wesCountry.charts.setAxisY(g, sizes, options);
		wesCountry.charts.setAxisX(g, sizes, options);

		// Values

		var barMarginWidth = sizes.barMarginWidth;
		var barMarginHeight = sizes.barMarginHeight;
		var groupMargin = options.groupMargin * sizes.xTickWidth / 100;

		var barWidth = sizes.barWidth;
		var barHeight = sizes.barHeight;

		var maxHeight = sizes.innerHeight - sizes.xAxisMargin;

		// Values

		for (var i = 0; i < length; i++) {
			var group = groups[i];
			var groupLength = group.length;

			for (var j = 0; j < groupLength; j++) {
				var element = group[j];
				var serie = options.getName(element);
				var id = element.id;
				var value = element.value;
				var url = element.url;

				var pos = "";

				var xPos = sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin * (2 * i + 1) + sizes.barMarginWidth
						+ sizes.xTickWidth * i;

				var height = barHeight;

				var yPos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin - 2 * sizes.barMarginHeight
						- height
						- (barHeight + 2 * sizes.barMarginHeight) * j;

				var radius = barWidth / 2;

				var elementOptions = {
					x: xPos,
					y: yPos,
					cx: xPos + radius,
					cy: yPos + radius,
					width: barWidth,
					height: height,
					r: radius
				};

				var colour = options.getElementColour(options, group[j], j);
				var rectangleStyle = String.format("fill: {0}", colour);

				// Events

				var selectBar = function(element) {
					var selectedBars = document.querySelectorAll(options.container + ' .inner-bar[selected]');

					for (var i = 0; i < selectedBars.length; i++)
						unselectBar(selectedBars[i]);

					var rect = element.querySelector('.inner-bar');

					rect.colour = rect.style.fill;
					
					if (options.showOverColour && options.overColour && options.overColour !== 'none') {
						rect.style.fill = options.overColour;
					}
					
					rect.setAttribute("selected", "selected");
				};

				var onmouseover = function(event) {
					selectBar(this);

					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				};

				var unselectBar = function(element) {
					var rect = element.querySelector('.inner-bar');

					if (rect)
						rect.style.fill = rect.colour;
				};

				var onmouseout = function(event) {
					unselectBar(this);
					options.events.onmouseout(wesCountry.charts.getElementAttributes(this, event));
				};

				var onclick = function(event) {
					this.style.fill = this.colour;
					options.events.onclick(wesCountry.charts.getElementAttributes(this, event));
				};

				var r = null;

				if (url && url != "") {
					var a = g.a({}, url ? url : "")
					r = a;
				}
				else {
					r = g;
				}

				// Node for element and text
				var nodeOptions = {
					id: id,
					serie: serie,
					value: value,
					pos: pos,
				};

				wesCountry.charts.setElementInfo(element, nodeOptions);

				var node = g.g(nodeOptions);

				if (options.rankingElementShape == "circle")
					r = node.circle(elementOptions);
				else
					r = node.rectangle(elementOptions);

				r.style(rectangleStyle).className(String.format("{0} inner-bar", serie));

				node.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick)
				.event("selectBar", function() {
						selectBar(this);
				}).event("unselectBar", function() {
					unselectBar(this);
				});

				// Value on bar
				if (options.valueOnItem.show == true) {
					node.text({
						x: xPos + barWidth / 2,
						y: yPos + height / 2,
						value: serie
					}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle",
						options.valueOnItem["font-colour"],
						options.valueOnItem["font-family"],
						options.valueOnItem["font-size"]))
					.className("ranking-item-name");
				}
			}
		}

		// Legend
		if (options.legend.show)
			wesCountry.charts.showLegend(g, sizes, options);

		// Tooltip
		wesCountry.charts.createTooltip(options);

		return svg;
	}

	function getSizes(svg, options, groups) {
		var width = svg.width();
		var height = svg.height();
		var marginTop = height * options.margins[0] / 100;
		var marginRight = width * options.margins[1] / 100;
		var marginBottom = height * options.margins[2] / 100;
		var marginLeft = width * options.margins[3] / 100;
		var yAxisMargin = options.yAxis.margin * width / 100;
		var xAxisMargin = options.xAxis.margin * height / 100;
		var innerWidth = width - marginLeft - marginRight;
		var innerHeight = height - marginTop - marginBottom;

		var maxRankingRows = options.maxRankingRows > 0 ? options.maxRankingRows : 8;
		var columnNumber = groups.length;
		var rowNumber = 0;
		var length = groups.length;

		for (var i = 0; i < length; i++) {
			var group = groups[i];
			var groupLength = group.length;

			rowNumber = Math.max(rowNumber, groupLength);
		}

		rowNumber = Math.min(rowNumber, maxRankingRows);

		var xTickWidth = columnNumber != 0 ? (innerWidth - yAxisMargin) / columnNumber : 0;
		var yTickHeight = (innerHeight - xAxisMargin) / rowNumber;

		var groupMargin = options.groupMargin * xTickWidth / 100;
		xTickWidth -= 2 * groupMargin;

		var barWidth = xTickWidth;
		var barHeight = yTickHeight;
		var barMarginWidth = options.barMargin * barWidth / 100;
		var barMarginHeight = options.barMargin * barHeight / 100;
		barWidth -= 2 * barMarginWidth;
		barHeight -= 2 * barMarginHeight;

		// Make size square
		if (options.rankingElementShape != "rectangle") {
			if (barWidth > barHeight) {
				var diff = barWidth - barHeight;
				barMarginWidth += diff / 2;
				barWidth = barHeight;
			}
			else {
				var diff = barHeight - barWidth;
				barMarginHeight += diff / 2;
				barHeight = barWidth;
			}
		}

		var legendItemSize = options.legend.itemSize * width / 100;
		var legendMargin = options.legend.margin * width / 100;

		return {
			width : width,
			height : height,
			marginTop : marginTop,
			marginRight : marginRight,
			marginBottom : marginBottom,
			marginLeft : marginLeft,

			innerWidth : innerWidth,
			innerHeight : innerHeight,

			yAxisMargin: yAxisMargin,
			xAxisMargin: xAxisMargin,

			xTickWidth: xTickWidth,
			yTickHeight: yTickHeight,

			barMarginWidth: barMarginWidth,
			barMarginHeight: barMarginHeight,
			barMargin: Math.min(barMarginWidth, barMarginHeight),
			groupMargin: groupMargin,
			barWidth: barWidth,
			barHeight: barHeight,

			ticksY: -1,
			ticksX: -1,
			minValue: 0,
			maxValue: 1,

			maxValueLength: groups.length,

			legendItemSize: legendItemSize,
			legendMargin: legendMargin
		};
	}

	function splitIntoGroups(series) {
		var groups = getGroups(series);
		var length = groups.length;

		// Split into smaller groups based on maxRankingRows
		var maxRankingRows = options.maxRankingRows > 0 ? options.maxRankingRows : 8;

		var splittedGroups = [];

		for (var i = 0; i < length; i++) {
			var group = groups[i];
			var groupLength = group.length;

			if (groupLength <= maxRankingRows)
				splittedGroups.push(group);
			else {
				var newGroup = [];
				var count = 0;

				for (var j = 0; j < groupLength; j++) {
					if (count >= maxRankingRows) {
						splittedGroups.push(newGroup);
						newGroup = [];
						count = 0;
					}

					var element = group[j];

					newGroup.push(element);
					count++;
				}

				splittedGroups.push(newGroup);
			}
		}

		return splittedGroups;
	}

	function getGroups(series) {
		var groups = [];

		var numbers = [];

		var length = series.length;

		var count = 1;

		for (var i = 0; i < length; i++) {
			var valueLength = series[i].values.length;

			for (var j = 0; j < valueLength; j++) {
				var url = series[i].urls && series[i].urls[j] ? series[i].urls[j] : "";
				var value = series[i].values[j];

				var element = wesCountry.clone(series[i]);
				element.url = url;
				element.value = value;

				numbers.push(element);

				count++;
			}
		}

		numbers = numbers.sort(function(a, b) {
			var a_name = options.getName(a);
			var b_name = options.getName(b);

			if (a.value != b.value)
				return a.value - b.value;
			else
				return a_name.localeCompare(b_name);
		});

		var count = 1;

		for (var i = 0; i < length; i++) {
			var element = numbers[i];

			if (element.value != null) {
				element.ranking = count;
				count++;
			}
		}

		var factor = Math.min(
			Math.ceil(Math.sqrt(numbers.length)),
			10
		);

		var deciles = getDeciles(numbers, factor);

		if (numbers.length > 0)
			deciles.push(numbers[numbers.length - 1].value);

		var length = deciles.length;
		var numberLength = numbers.length;

		var j = 0;

		for (var i = 0; i < length; i++) {
			var decile = deciles[i];

			var group = [];

			while (j <= numberLength - 1 && numbers[j].value <= decile) {
				group.push(numbers[j]);

				j++;
			}

			if (group.length > 0)
				groups.push(group);
		}

		return groups;
	}

	function getDeciles(numbers, factor) {
		var deciles = [];

		var length = numbers.length;

		for (var i = 1; i < factor; i++) {
			var pos = (length + 1) * i / factor;
			var remainder = pos - Math.floor(pos);

			var index1 = Math.floor(pos) - 1;
			var index2 = Math.ceil(pos) - 1;

			var value1 = numbers[index1].value;
			var value2 = numbers[index2].value;

			var decile = value1 + (value2 - value1) * remainder;

			deciles.push(decile);
		}

		return deciles;
	}
};

String.format = function(pattern)
{
	for (var i = 1; i < arguments.length; i++)
	{
		var regex = new RegExp('\\{' + (i - 1) + '\\}', 'g');
		pattern = pattern.replace(regex, arguments[i]);
	}
	return pattern;
};

if (typeof(exports) === "undefined")
	exports = new Object();

var jGraf = exports.jGraf = new (function() {
	var defaultOptions = {
		width: 600,
		height: 400,
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
			title: "Meses",
			colour: "none",
			margin: 10,
			tickColour: "none",
			values: ["Ene", "Feb", "Mar", "Abr", "May"],
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
            name: "Primero",
            values: [-1, 4, 5, 3, 6],
            urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }, {
            name: "Segundo",
            values: [1, 7, 5, 6, 4],
            urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }, {
        	name: "Tercero",
        	values: [0, 1, 2, 3, 4],
        	urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
        }],
        legend: {
	        show: true,
	        itemSize: 1,
	        "font-colour": "#666",
			"font-family": "Helvetica",
			"font-size": "16px"
        }
	};
	
	////////////////////////////////////////////////////////////////////////////////
	//                                  BAR CHART
	////////////////////////////////////////////////////////////////////////////////
		
	this.barChart = function(options) {
		return renderChart();
	
		function renderChart() {
			// Options and default options
			options = mergeOptionsAndDefaultOptions(options, defaultOptions);	
			options.yAxis["from-zero"] = true;
			
			if (options.sortSeries)
				options.series = sortSeries(options.series);
			
			// SVG creation
			var svg = getSVG(options);
			
			// Size and margins (%)
			var sizes = getSizes(svg, options);
			
			var g = svg.g();
	
			// Background
		
			setBackground(g, sizes, options); 		
					
			// X Axis & Y Axis		
			setAxisY(g, sizes, options);
			setAxisX(g, sizes, options);
			
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
				for (var j = 0; j < numberOfSeries; j++) {
					var value = options.series[j].values[i];
					var url = options.series[j].urls ? options.series[j].urls[i] : "";
					
					if (!value)
						value = 0;
					
					var xPos = sizes.marginLeft + sizes.yAxisMargin + sizes.groupMargin * (2 * i + 1) + sizes.barMargin
							+ sizes.xTickWidth * i 
							+ (barWidth + 2 * sizes.barMargin) * j;
							
					if (value >= 0)	{
						var yPos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
								+ minValuePos
								- (value / (sizes.maxValue - sizes.minValue)) 
								* maxHeight;
					}
					else {
						var yPos = sizes.marginTop + sizes.innerHeight - sizes.xAxisMargin
								+ minValuePos
					}
							
					var height = (Math.abs(value) / (sizes.maxValue - sizes.minValue)) 
							* maxHeight;
						
					var rectangleOptions = {
						x: xPos,
						y: yPos,
						width: barWidth,
						height: height
					};			
					
					var rectangleStyle = String.format("fill: {0}", options.serieColours[j]);
				
					var onmouseover = function() { 
						this.colour = this.style.fill;
						this.style.fill = options.overColour;
					};
												
					var onmouseout = function() { 
						this.style.fill = this.colour;
					};
					
					if (url && url != "") {
						var a = g.a({}, url ? url : "")
						a.rectangle(rectangleOptions).style(rectangleStyle)
						.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onmouseout);
					}
					else {
						g.rectangle(rectangleOptions).style(rectangleStyle)
						.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onmouseout);
					}				
				
					// Value on bar
					if (options.valueOnItem.show == true) {
						g.text({
							x: xPos + barWidth / 2,
							y: yPos - (options.height / 100) * options.valueOnItem.margin,
							value: value.toFixed(2)
						}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle", 
							options.valueOnItem["font-colour"],
							options.valueOnItem["font-family"],
							options.valueOnItem["font-size"]));
					}
				}
			}
			
			// Legend
			if (options.legend.show)
				showLegend(g, sizes, options);
				
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
			var maxAndMinValues = getMaxAndMinValuesAxisY(options);
			var maxValue = maxAndMinValues.max;
			var minValue = maxAndMinValues.min > 0 ? 0 : maxAndMinValues.min;
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
				
				legendItemSize: legendItemSize
			};
		}		
	};
	
	////////////////////////////////////////////////////////////////////////////////
	//                                  LINE CHART
	////////////////////////////////////////////////////////////////////////////////
		
	this.lineChart = function(options) {
		return generateLineChart(options, false);
	}	
	
	////////////////////////////////////////////////////////////////////////////////
	//                                  AREA CHART
	////////////////////////////////////////////////////////////////////////////////
		
	this.areaChart = function(options) {
		return generateLineChart(options, true);
	}
		
	// Auxiliary line fuction	
		
	function generateLineChart(options, area) {
		return renderChart();
	
		function renderChart() {
			// Options and default options
			options = mergeOptionsAndDefaultOptions(options, defaultOptions);	

			if (options.sortSeries)
				options.series = sortSeries(options.series);
			
			// SVG creation
			var svg = getSVG(options);
			
			// Size and margins (%)
			var sizes = getSizes(svg, options);
			
			var g = svg.g();
		
			// Background
		
			setBackground(g, sizes, options); 
					
			// X Axis & Y Axis		
			setAxisY(g, sizes, options);
			setAxisX(g, sizes, options);
					
			// Values
			var length = options.series.length;
			var valueLength = sizes.maxValueLength;
		
			var maxHeight = sizes.innerHeight - sizes.xAxisMargin;
			var zeroPos = sizes.minValue / (sizes.maxValue - sizes.minValue) * maxHeight;
			
			// Iteration
			for (var i = 0; i < length; i++) {
				// Polygon path
				var pathD = "";
				if (area) {
					var path = g.path();
				}
				// Position of zero y line
				var minValue = Math.max(0, sizes.minValue);
				var posZero = getYPos(minValue, sizes, zeroPos, maxHeight);
			
				var lineId = "l" + guid();
				
				for (var j = 0; j < valueLength; j++) {
					var value = options.series[i].values[j];
					var valuePrev = j > 0 ? options.series[i].values[j - 1] : 0;
					var url = options.series[i].urls ? options.series[i].urls[j] : "";
					
					if (!value)
						value = 0;
						
					if (!valuePrev)
						valuePrev = 0;
					
					var xPos = getXPos(j, sizes, zeroPos);
					var yPos = getYPos(value, sizes, zeroPos, maxHeight);
					var xPosPrev = getXPos(j - 1, sizes, zeroPos);	
					var yPosPrev = getYPos(valuePrev, sizes, zeroPos, maxHeight);
					
					var pointOptions = {
						cx: xPos,
						cy: yPos,
						r: 5,
						"class": lineId
					};
					
					var pointStyle = String.format("fill: {0}", options.serieColours[i % options.serieColours.length]);
					
					var setLineWidth = function(element, stroke) {
						var className = element.getAttribute("class");
						var lines = element.parentNode.querySelectorAll("line." + className);
						var length = lines.length;
					
						for (var k = 0; k < length; k++) {
							lines[k].setAttribute("stroke-width", stroke)
						}	
					};
					
					var onmouseover = function() { 
						this.setAttribute("r", 8);
						setLineWidth(this, 2);
					};
												
					var onmouseout = function() { 
						this.setAttribute("r", 5); 
						setLineWidth(this, 1);
					};
					
					if (url && url != "") {
						var a = g.a({}, url ? url : "")
						a.circle(pointOptions)
						.style(pointStyle).event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onmouseout);
					}
					else {
						g.circle(pointOptions)
						.style(pointStyle).event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onmouseout);
					}
								
					// Value on bar		
					if (options.valueOnItem.show == true) {
						g.text({
							x: xPos,
							y: yPos - (options.height / 100) * options.valueOnItem.margin,
							value: value == 0 ? "0" : value.toFixed(2)
						}).style(String.format("fill: {0};font-family:{1};font-size:{2};text-anchor: middle;dominant-baseline: middle", 
							options.valueOnItem["font-colour"],
							options.valueOnItem["font-family"],
							options.valueOnItem["font-size"])
						);
					}
					
					if (j > 0) {
						g.line({
							x1: xPosPrev,
							x2: xPos,
							y1: yPosPrev,
							y2: yPos,
							"stroke-width": 1,
							"class": lineId
						}).style(String.format("stroke: {0}", options.serieColours[i % options.serieColours.length]))
						.event("onmouseover", function() { setLineWidth(this, 2); })
						.event("onmouseout", function() { setLineWidth(this, 1); });
						
						pathD += String.format(" L{0} {1}", xPos, yPos);
					}
					else {
						pathD = String.format("M{0} {1} L{2} {3}", xPos, posZero, xPos, yPos);
					}
				}
				
				pathD += String.format(" L{0} {1} Z", xPos, posZero);
				if (area) {
					path.attribute(null, "d", pathD)
					.style(String.format("stroke: {0}; fill: {0}; opacity: 0.5", options.serieColours[i % options.serieColours.length]));
				}
			}

			// Legend
			if (options.legend.show)
				showLegend(g, sizes, options);
				
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
			var maxAndMinValues = getMaxAndMinValuesAxisY(options);
			var maxValue = maxAndMinValues.max;
			var minValue = maxAndMinValues.min;
			var maxValueLength = maxAndMinValues.valueLength; 	
			
			// If max and min Value are the same we set difference
			if (minValue == maxValue) {
				minValue -= 2;
				maxValue += 2;
			}
			
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
				
				legendItemSize: legendItemSize
			};
		}
	}		
	
	////////////////////////////////////////////////////////////////////////////////
	//                                  PIE CHART
	////////////////////////////////////////////////////////////////////////////////
		
	this.pieChart = function(options) {
		return renderChart();
	
		function renderChart() {
			// Options and default options
			options = mergeOptionsAndDefaultOptions(options, defaultOptions);	
			
			if (options.sortSeries)
				options.series = sortSeries(options.series);			
			
			// SVG creation
			var svg = getSVG(options);
			
			// Size and margins (%)
			var sizes = getSizes(svg, options);
			
			var g = svg.g();
	
			// Background
		
			setBackground(g, sizes, options);
			
			// Values
			
			var numberOfPies = sizes.maxValueLength; 
			
			if (numberOfPies == 1) {
				var radius = Math.min(sizes.innerWidth - 2 * sizes.yAxisMargin, sizes.innerHeight - 2 * sizes.xAxisMargin) / 2;
				var startX = sizes.innerWidth / 2;
				var startY = sizes.innerHeight / 2;
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
				
				// Pie
				
				var total = 0;
				var numberOfGreaterThanZero = 0;
				
				var length = options.series.length;
				
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
	
			    if (numberOfGreaterThanZero == 1) {
			    	var colour = "";
			    	
			    	for(var j = 0; j < length; j++)
			    		if (angles[j] != 0) {
			    			colour = options.serieColours[j];
				    		break;
			    		}
			    		
			    	g.circle({
				    	cx: cx,
				    	cy: cy,
				    	r: radius
			    	}).style(String.format("fill: {0}", colour));
			    }
			    else {
				    var startangle = 0;
					
					for (var j = 0; j < length; j++) {
						var endangle = startangle + angles[j];
						var value = Math.abs(options.series[j].values[i]).toFixed(2);
						
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
				        var path = g.path();
				        
				        // This string holds the path details
				        var d = "M " + cx + "," + cy +  // Start at circle center
				            " L " + x1 + "," + y1 +     // Draw line to (x1,y1)
				            " A " + radius + "," + radius +       // Draw an arc of radius r
				            " 0 " + big + " 1 " +       // Arc details...
				            x2 + "," + y2 +             // Arc goes to to (x2,y2)
				            " Z";                       // Close path back to (cx,cy)
				            
				        path.attribute(null, "d", d).style(String.format("fill: {0}", options.serieColours[j]));
				        
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
				showLegend(g, sizes, options);
				
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
			var maxAndMinValues = getMaxAndMinValuesAxisY(options);
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
				
				legendItemSize: legendItemSize
			};
		}		
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                  POLAR CHART
	////////////////////////////////////////////////////////////////////////////////
		
	this.polarChart = function(options) {
		return renderChart();
	
		function renderChart() {
			// Options and default options
			options = mergeOptionsAndDefaultOptions(options, defaultOptions);				
			
			// SVG creation
			var svg = getSVG(options);
			
			// Size and margins (%)
			var sizes = getSizes(svg, options);
			
			var g = svg.g();
	
			// Background
		
			setBackground(g, sizes, options);
			
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
				var x = cx + (radius + sizes.xAxisMargin / 2) * Math.cos((2 * Math.PI * i) / numberOfVertices - Math.PI / 2);
				var y = cy + (radius + sizes.xAxisMargin / 2) * Math.sin((2 * Math.PI * i) / numberOfVertices - Math.PI / 2);
	
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
					
					if (!value)
						value = 0;
					
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
			
			// Polygon drawing
			
			for (var i = 0; i < length; i++) {
				for (var j = 0; j < numberOfVertices; j++) {
					var vertex = polygonVertices[i][j];
					var vertexPrev = j == 0 ? polygonVertices[i][numberOfVertices - 1] : polygonVertices[i][j - 1];
				
					g.circle({
						cx: vertex.x,
						cy: vertex.y,
						r: 5
					}).style(String.format("fill: {0}", options.serieColours[i % options.serieColours.length]));
					
					g.line({
				  		x1: vertexPrev.x,
				  		y1: vertexPrev.y,
				  		x2: vertex.x,
				  		y2: vertex.y
				  	}).style(String.format("stroke: {0};", options.serieColours[i % options.serieColours.length]));
				}
			}
		
			// Legend
			if (options.legend.show)
				showLegend(g, sizes, options);
				
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
			var maxAndMinValues = getMaxAndMinValuesAxisY(options);
			var maxValue = maxAndMinValues.max;
			var minValue = maxAndMinValues.min > 0 ? 0 : maxAndMinValues.min;
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
				
				legendItemSize: legendItemSize
			};
		}	
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                SCATTER PLOT
	////////////////////////////////////////////////////////////////////////////////
		
	this.scatterPlot = function(options) {
		return renderChart();
	
		function renderChart() {
			// Options and default options
			options = mergeOptionsAndDefaultOptions(options, defaultOptions);	
		
			// SVG creation
			var svg = getSVG(options);
			
			// Size and margins (%)
			var sizes = getSizes(svg, options);
		
			var g = svg.g();
		
			// Background
		
			setBackground(g, sizes, options); 
					
			// X Axis & Y Axis		
			setAxisY(g, sizes, options);
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
		
			for (var i = 0; i < length; i++) {
				var values = options.series[i].values;
				var valueLength = values.length;
			
				for (var j = 0; j < valueLength; j++) {
					var valueX = values[j][0] ? values[j][0] : 0;
					var valueXPrev = 0;
				
					if (j > 0)
						valueXPrev = values[j - 1][0] ? values[j - 1][0] : 0;
					
					if (!valueX)
						valueX = 0;
						
					if (!valueXPrev)
						valueXPrev = 0;			
				
					var valueY = values[j][1] ? values[j][1] : 0;
					var valueYPrev = 0;
					
					if (j > 0)
						valueYPrev = values[j - 1][1] ? values[j - 1][1] : 0;
					
					if (!valueY)
						valueY = 0;
						
					if (!valueYPrev)
						valueYPrev = 0;
	
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
	
					g.circle({
						cx: xPos,
						cy: yPos,
						r: 5
					}).style(String.format("fill: {0}", options.serieColours[i % options.serieColours.length]));
					
				}
			}
			
			// Legend
			if (options.legend.show)
				showLegend(g, sizes, options);
				
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
			var maxAndMinValues = getMaxAndMinValuesAxisY(options);
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
				
				legendItemSize: legendItemSize
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
			var xTickWidth = (sizes.innerWidth - sizes.yAxisMargin) / (ticksX);	
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
			
			var maxAndMinValues = getNearestNumber(minValue, maxValue);
		
			return { 
				max: maxAndMinValues.max, 
				min: maxAndMinValues.min, 
				inc: maxAndMinValues.inc
			};
		}		
	}	
	
	////////////////////////////////////////////////////////////////////////////////
	//                                 SORT SERIES
	////////////////////////////////////////////////////////////////////////////////
	
	// We evaluate the number of values of this series than are greater than the other series
	
	function sortSeries(series) {
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
	
	function getSVG(options) {
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
	
	function showLegend(container, sizes, options) {
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
	
	function mergeOptionsAndDefaultOptions(options, defaultOptions) {
		if (options) {
			if (typeof options === "string")
				options = { container: options };
		
			var auxOptions = clone(defaultOptions);
			
			for (var option in options)
				auxOptions[option] = mergeOptions(auxOptions[option], options[option]);
			
			options = auxOptions;
		}
		else
			options = clone(defaultOptions);
			
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
	
	function clone(obj) {
		// Not valid for copying objects that contain methods
	    return JSON.parse(JSON.stringify(obj));
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                                   AXIS
	////////////////////////////////////////////////////////////////////////////////
	
	function setAxisY(container, sizes, options) {
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

	function setAxisX(container, sizes, options) {		
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
		
		
		var maxAndMinValues = getNearestNumber(minValue, maxValue);
	
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
	
	function setBackground(container, sizes, options) {
		container.rectangle({
			x: 0,
			y: 0,
			width: sizes.width,
			height: sizes.height
		}).style(String.format("fill: {0}", options.backgroundColour));
	}	
	
	function getNearestNumber(minValue, maxValue) {
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

	function guid() {
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         	s4() + '-' + s4() + s4() + s4();
	}
})();
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
				var pos = options.xAxis.values[j];
				
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
					"data-x": xPos
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
					element.style.fill = options.overColour;
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
					barG.text({
						x: x,
						y: y,
						value: value.toFixed(2),
						transform: String.format("rotate({0} {1} {2})", options.valueOnItem.rotation, x, y),
						"data-inc-x": barWidth / 2,
						"data-rotate": options.valueOnItem.rotation
					}).style(String.format("fill: {0};font-family:{1};font-size:{2} ;dominant-baseline: middle; text-anchor: {3};",
						options.nameUnderItem["font-colour"],
						options.nameUnderItem["font-family"],
						options.nameUnderItem["font-size"],
						anchor));
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

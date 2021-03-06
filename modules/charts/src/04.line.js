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

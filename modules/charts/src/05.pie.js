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
				if (options.showOverColour) {
					this.colour = this.style.fill;
					this.style.fill = options.overColour;

					options.events.onmouseover(wesCountry.charts.getElementAttributes(this, event));
				}
			};

			var onmouseout = function(event) {
				if (options.showOverColour) {
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

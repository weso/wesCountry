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
			this.style.fill = options.overColour;

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

				var element = options.series[i];
				var value = element.values[j];
				var id = element.id;
				var serie = element.name;
				var pos = valueX;

				if (!valueX)
					valueX = 0;

				var valueY = values[j][1] ? values[j][1] : 0;

				if (!valueY)
					valueY = 0;

				if (valueX > maxX)
					maxX = valueX;

				if (valueX < minX)
					minX = valueX;

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

				g.circle(circleOptions).style(String.format("fill: {0}", colour))
				.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
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

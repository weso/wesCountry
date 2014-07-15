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
					rect.style.fill = options.overColour;
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

		var maxAndMinValues = wesCountry.charts.getNearestNumber(minValue, maxValue);

		return {
			max: maxAndMinValues.max,
			min: maxAndMinValues.min,
			valueLength: maxValueLength,
			length: length,
			inc: maxAndMinValues.inc
		};
	}
};

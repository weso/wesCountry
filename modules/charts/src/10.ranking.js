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
					rect.style.fill = options.overColour;
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

			legendItemSize: legendItemSize
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

////////////////////////////////////////////////////////////////////////////////
//                                  BAR CHART
////////////////////////////////////////////////////////////////////////////////
	
wesCountry.charts.barChart = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);	
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
			for (var j = 0; j < numberOfSeries; j++) {
				var serie = options.series[j].name;
				var value = options.series[j].values[i];
				var url = options.series[j].urls ? options.series[j].urls[i] : "";
				var pos = options.xAxis.values[j];
				
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
					height: height,
					serie: serie,
					value: value,
					pos: pos
				};			
				
				var rectangleStyle = String.format("fill: {0}", options.serieColours[j]);
			
				// Events
			
				var onmouseover = function() {
					this.colour = this.style.fill;
					this.style.fill = options.overColour;
					
					options.events.onmouseover(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
				};
											
				var onmouseout = function() { 
					this.style.fill = this.colour;
					options.events.onmouseout(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
				};
				
				var onclick = function() { 
					this.style.fill = this.colour;
					options.events.onclick(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
				};
				
				if (url && url != "") {
					var a = g.a({}, url ? url : "")
					var r = a.rectangle(rectangleOptions).style(rectangleStyle)
					.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
				}
				else {
					var r = g.rectangle(rectangleOptions).style(rectangleStyle)
					.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
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
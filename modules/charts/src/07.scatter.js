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
	
		for (var i = 0; i < length; i++) {
			var values = options.series[i].values;
			var valueLength = values.length;
		
			for (var j = 0; j < valueLength; j++) {
				var valueX = values[j][0] ? values[j][0] : 0;
				var valueXPrev = 0;
				
				var value = options.series[i].values[j];
				var serie = options.series[i].name;
				var pos = valueX;
			
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
					r: 5,
					serie: serie,
					value: value,
					pos: pos
				}).style(String.format("fill: {0}", options.serieColours[i % options.serieColours.length]))
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
		
		var maxAndMinValues = wesCountry.charts.getNearestNumber(minValue, maxValue);
	
		return { 
			max: maxAndMinValues.max, 
			min: maxAndMinValues.min, 
			inc: maxAndMinValues.inc
		};
	}		
};
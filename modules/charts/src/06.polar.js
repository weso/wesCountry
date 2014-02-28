////////////////////////////////////////////////////////////////////////////////
//                                  POLAR CHART
////////////////////////////////////////////////////////////////////////////////
	
wesCountry.charts.polarChart = function(options) {
	return renderChart();

	function renderChart() {
		// Options and default options
		options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);				
		
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
		
		// Events
		
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
			options.events.onmouseover(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
		};
									
		var onmouseout = function() { 
			this.setAttribute("r", 5); 
			setLineWidth(this, 1);
			options.events.onmouseout(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
		};
		
		var onclick = function() { 
			this.setAttribute("r", 5); 
			setLineWidth(this, 1);
			options.events.onclick(this.getAttribute("serie"), this.getAttribute("pos"), this.getAttribute("value"));
		};			
		
		// Polygon drawing
		
		for (var i = 0; i < length; i++) {
			var lineId = "l" + wesCountry.charts.guid();
		
			for (var j = 0; j < numberOfVertices; j++) {
				var vertex = polygonVertices[i][j];
				var vertexPrev = j == 0 ? polygonVertices[i][numberOfVertices - 1] : polygonVertices[i][j - 1];
				var value = options.series[i].values[j];
				var serie = options.series[i].name;
				var pos = options.xAxis.values[j];
			
				if (options.vertex.show) {
					g.circle({
						cx: vertex.x,
						cy: vertex.y,
						r: 5,
						serie: serie,
						value: value,
						pos: pos,
						"class": lineId
					}).style(String.format("fill: {0}", options.serieColours[i % options.serieColours.length]))
					.event("onmouseover", onmouseover).event("onmouseout", onmouseout).event("onclick", onclick);
				}
				
				g.line({
			  		x1: vertexPrev.x,
			  		y1: vertexPrev.y,
			  		x2: vertex.x,
			  		y2: vertex.y,
			  		"class": lineId
			  	}).style(String.format("stroke: {0};", options.serieColours[i % options.serieColours.length]));
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
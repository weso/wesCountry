if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.maps = new (function() {
	this.createMap = function(options) {
		var namespace = 'http://www.w3.org/2000/svg';
		
		var defaultOptions = {
			"projection": "miller",
			"countries": [],
			"backgroundColour": "#fff",
			"borderColour": "#ccc",
			"borderWidth": 1.5,
			"hoverColour": "#ddd",
			"colourRange": ['#A9F5BC', '#1184a7'],
			"container": "body",
			"onCountryClick": function(info) {
				alert(info.iso3);
			},
			"onCountryOver": function(info) {
				if (visor) {
					visor.innerHTML = info.nombre;
				}
			}
		};
		
		// Country info visor
		var visor = null;
		
		var svg = null;
		
		// g for every element
		var panel = null;
		
		// Zoom factor
		var factor = 1;
		var initialFactor = 1;
		
		// Translate position
		var translate = {
			x: 0,
			y: 0
		};
		
		var initialTranslate = {
			x: 0,
			y: 0
		}
	
		options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);
	
		function init(map) {
			getProjection();
			
			var container = document.querySelector(options.container);
		
			svg = document.createElementNS(namespace, "svg"); 
			svg.setAttributeNS(null, 'width', container.offsetWidth);
			svg.setAttributeNS(null, 'height', container.offsetWidth / 1.3);

			//svg.setAttributeNS(null, 'viewBox', '0 -500 2752.766 2537.631');
			
			container.appendChild(svg);
			
			// Panel
			
			panel = document.createElementNS(namespace, "g");
			svg.appendChild(panel);
			
			// Styles
			
			var style = document.createElementNS(namespace, "style");
			style.setAttributeNS(null, 'type', 'text/css');
			svg.appendChild(style);
			
			var styleContent = String.format(".water { fill: {0}; }", options.backgroundColour);
			styleContent += String.format("\n.land { stroke: {0}; stroke-width: {1}; fill: #fff; }", options.borderColour, options.borderWidth);
			
			if (options.hoverColour) {
				styleContent += String.format("\n.land:hover { fill: {0}; }", options.hoverColour);
				styleContent += String.format("\n.land-group:hover, .land-group:hover g, .land-group:hover path { fill: {0}; }", options.hoverColour);
			}
			
			style.appendChild(document.createTextNode(styleContent));
			
			// Countries to highlight
			
			var countryList = getCountriesToShow(style);

			// Country creation
			
			var countries = options.projection.countries;
			
			for (var i = 0; i < countries.length; i++) {
				var country = countries[i];
				
				var element = null;
				
				if (country.path)
					element = createPath(country);
					
				if (country.elements)
					element = createGroup(country);
					
				if (element && options.onCountryClick)
					element.onclick = function() {
						if (this.id && this.id.length == 3)
							options.onCountryClick(this.info);
					}
			
				if (element && options.onCountryOver)
					element.onmouseover = function() {
						if (this.id && this.id.length == 3)
							options.onCountryOver(this.info);
					}
					
				if (element) {
					element.info = country;
					
					var value = countryList[element.id] ? countryList[element.id].value : null;
					
					element.info.value = value;	
				}
	
				panel.appendChild(element);
			}
			
			// Initial factor
			var width = panel.getBoundingClientRect().width;
			var svgWidth = svg.offsetWidth;
			
			factor = initialFactor = svgWidth / width;
			
			var start = options.projection.start;
			
			translate = {
				x: start.x,
				y: start.y
			};
			
			initialTranslate = {
				x: start.x,
				y: start.y
			};
			
			updatePositionAndZoom();
			
			// Country visor
			
			visor = document.createElement('div');
			visor.id = 'country-visor';
			visor.className = 'visor';
			container.appendChild(visor);
			
			// Zoom buttons
			
			createZoomButtons(container);
			
			// Panning
			
			var point = null;
			
			svg.onmousedown = function(event) {
				if (factor > initialFactor) {
					point = {
						x: event.clientX,
						y: event.clientY
					};
				}
			};
			
			svg.onmousemove = function(event) {
				if (!point)
					return;
			
				var newPoint = {
					x: event.clientX,
					y: event.clientY
				};
				
				translate.x += (newPoint.x - point.x);
				translate.y += (newPoint.y - point.y);
				
				updatePositionAndZoom(translate);
				
				point = newPoint
			};
			
			svg.onmouseup = function() {
				point = null;	
			};
			
			return map;
		};

		this.zoomToCountry = function(countryCode) {
			var country = svg.querySelector('#' + countryCode);
			
			if (!country)
				return;
				
			var countrySize = country.getBoundingClientRect();
			var svgSize = svg.getBoundingClientRect();
		
			widthFactor = svgSize.width / countrySize.width;
			heightFactor = svgSize.height / countrySize.height;
			
			if (widthFactor > heightFactor) {
				if (countrySize.height * widthFactor > svgSize.height)
					factor *= (svgSize.height / countrySize.height) * 0.8;
				else
					factor *= (svgSize.width / countrySize.width) * 0.8;
			}
			else {
				if (countrySize.width * heightFactor > svgSize.width)
					factor *= (svgSize.width / countrySize.width) * 0.8;
				else
					factor *= (svgSize.height / countrySize.height) * 0.8;
			}

			updatePositionAndZoom();

			var countrySize = country.getBoundingClientRect();

			translate.x -= countrySize.left / factor - svgSize.left / factor - ((svgSize.width - countrySize.width) / 2) / factor;
			translate.y -= countrySize.top / factor - svgSize.top / factor - ((svgSize.height - countrySize.height) / 2) / factor;
			
			updatePositionAndZoom();
		}
		
		function updatePositionAndZoom() {
			panel.setAttributeNS(null, 'transform', String.format("scale({0}) translate({1}, {2})", factor, translate.x, translate.y));
		}
		
		////////////////////////////////////////////////////////////////////////////////
		//                              ZOOM BUTTONS
		////////////////////////////////////////////////////////////////////////////////		
		
		function createZoomButtons(container) {
			var buttons = document.createElement('div');
			buttons.className = 'zoom-buttons';
			container.appendChild(buttons);
		
			// Plus
			var plus = document.createElement('button');
			plus.innerHTML = '+';
			
			buttons.appendChild(plus);
			
			plus.onclick = function() {
				factor *= 2;
								
				var svgSize = svg.getBoundingClientRect();

				translate.x -= (svgSize.width / 2) / factor;
				translate.y -= (svgSize.height / 2) / factor;
				
				updatePositionAndZoom();
			}
			
			// Minus
			var minus = document.createElement('button');
			minus.innerHTML = '-';
			
			buttons.appendChild(minus);
			
			minus.onclick = function() {			
				if (factor > initialFactor) {
					var svgSize = svg.getBoundingClientRect();
					
					translate.x += (svgSize.width / 2) / factor;
					translate.y += (svgSize.height / 2) / factor;					
					
					factor /= 2;
					
					if (factor < initialFactor + 0.3)
						factor = initialFactor;
					
					if (factor == initialFactor) {
						translate.x = initialTranslate.x;
						translate.y = initialTranslate.y;
					}					
					
					updatePositionAndZoom();
				}
			}
		
			// Left
			var left = document.createElement('button');
			left.innerHTML = '<';
			
			buttons.appendChild(left);
			
			left.onclick = function() {
				if (factor > initialFactor) {
					translate.x -= 100;
					updatePositionAndZoom();
				}
			}
			
			// Right
			var right = document.createElement('button');
			right.innerHTML = '>';
			
			buttons.appendChild(right);
			
			right.onclick = function() {
				if (factor > initialFactor) {
					translate.x += 100;
					updatePositionAndZoom();
				}
			}
			
			// Up
			var up = document.createElement('button');
			up.innerHTML = '^';
			
			buttons.appendChild(up);
			
			up.onclick = function() {
				if (factor > initialFactor) {
					translate.y -= 100;
					updatePositionAndZoom();
				}
			}
			
			// Down
			var down = document.createElement('button');
			down.innerHTML = '-';
			
			buttons.appendChild(down);
			
			down.onclick = function() {
				if (factor > initialFactor) {
					translate.y += 100;			
					updatePositionAndZoom();
				}
			}
		}
		
		function getCountriesToShow(style) {
			var countries = options.countries;
			
			var valueList = [];
			
			for (var i = 0; i < countries.length; i++) {
				var value = countries[i].value;
				
				if (valueList.indexOf(value) == -1)
					valueList.push(value);
			}		
						
			var colours = wesCountry.colourRange(options.colourRange, valueList.length);
			
			valueList.sort();
			
			var valueColours = {};
			
			for (var i = 0; i < valueList.length; i++)
				valueColours[valueList[i]] = colours[i];
			
			var countryList = {};
			
			var styleContent = "";
			
			for (var i = 0; i < countries.length; i++) {
				var country = countries[i];
				var value = country.value;
				
				var colour = valueColours[value]; 
				
				countryList[country.code] = country;

				// Create CSS class to asign country colour				
				styleContent += String.format("\n.{0}, .{0} g, .{0} path { fill: {1}; }", country.code, colour);
				styleContent += String.format("\n.{0}:hover, .{0}:hover g, .{0}:hover path { fill: {1}; opacity: 0.9; }", country.code, colour);
			}
	
			style.appendChild(document.createTextNode(styleContent));
		
			return countryList;
		}
		
		function getProjection() {
			var projection = options.projection;
		
			if (wesCountry.mapProjections[projection]) {
				options.projection = wesCountry.mapProjections[projection];
				
				return true;	
			}
			
			return false;
		}
		
		function createPath(element, className) {
			var path = document.createElementNS(namespace, "path"); 
			 
			if (element.iso3)
				path.setAttributeNS(null, "id", element.iso3);  

			if (!className)
				className = element.iso3 && element.iso3.length != 3 ? 'water' : 'land';
			
			if (element.iso3)
				className += ' ' + element.iso3;	
			
			path.setAttributeNS(null, "class", className);
				
			path.setAttributeNS(null, "d", element.path); 
			
			if (element.transform)
				path.setAttributeNS(null, 'transform', element.transform);
				
			return path;	
		}
		
		function createGroup(element, className) {
			var g = document.createElementNS(namespace, "g"); 
			g.setAttributeNS(null, "id", element.iso3); 
			
			if (element.transform)
				g.setAttributeNS(null, 'transform', element.transform);
				
			if (!className && element.iso3)
				className = element.iso3 && element.iso3.length != 3 ? 'water' : 'land';	
	
			if (className) {
				var c = className;
				
				if (className != 'water')
					c += ' land-group'
			
				if (element.iso3)
					c += ' ' + element.iso3;
			
				g.setAttributeNS(null, 'class', c);
			}	
				
			if (element.elements)
				for (var i = 0; i < element.elements.length; i++) {
					var child = element.elements[i];
				
					if (child.path)
						g.appendChild(createPath(child, className));
					
					if (child.elements)
						g.appendChild(createGroup(child, className));
				}

			return g;
		}
	
		return init(this);
	}
})();
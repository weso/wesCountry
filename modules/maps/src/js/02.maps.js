if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.maps = new (function() {
  var defaultOptions = {
    "projection": "miller",
    "countries": [],
    "countryCode": "iso3",
    "backgroundColour": "#fff",
    "landColour": "#fff",
    "borderColour": "#ccc",
    "borderWidth": 1.5,
    "hoverColour": "#ddd",
    "colourRange": ['#A9F5BC', '#1184a7'],
    "container": "body",
    "zoom": true,
    "zoomToCountryFactor": 0.8,
    "selectedRegions": [],
    "selectedRegionColour": '#333',
    "selectedRegionBorderColour": "#ccc",
    "onCountryClick": function(info) {
      alert(info.iso3);
    },
    "onCountryOver": function(info, visor) {
      if (visor) {
        visor.innerHTML = '';

        var name = document.createElement('span');
        name.innerHTML = info.name;
        name.className = 'name';
        visor.appendChild(name);

        var value = document.createElement('span');
        value.innerHTML = info.value;
        value.className = 'value';
        visor.appendChild(value);
      }
    },
    "onCountryOut": function(info, visor) {
      if (visor)
        visor.innerHTML = '';
    },
    "getValue": function(country) {
    	return country.value;
    }
  };

  this.createMap = function(options) {
    options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

    var container = document.querySelector(options.container);

    if (!container)
      return;

    var mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    container.appendChild(mapContainer);

    var mapContainerHeight = container.offsetHeight > 0 ? container.offsetHeight : options.height;
    var mapContainerWidth = container.offsetWidth > 0 ? container.offsetWidth : options.width;

    // Group by time

    var groupedCountries = groupCountriesByTime(options);
    var times = groupedCountries.times;
    times.sort();
    var countryList = groupedCountries.countries;

    var maps = [];

    // Timeline

    if (times.length > 1) {
      var timelineContainer = document.createElement('div');
      timelineContainer.className = 'timeline-container';
      container.appendChild(timelineContainer);

      var id = String.format("timeline-container-{0}", wesCountry.guid());
      timelineContainer.id = id;

      wesCountry.selector.timeline({
        container: String.format('#{0}', id),
        elements: times,
        selected: times[times.length - 1],
        onChange: function(element, index) {
          if (options.onChange)
          	options.onChange.call(this, element, index);

          if (selectedMap === maps[index])
          	return;

          selectedMap.hideMap();

          // On demand map creation
          if (!maps[index])
          	maps[index] = new createOneMap(mapContainer, options, mapData[index], true);

          selectedMap = maps[index];
          selectedMap.showMap();
        }
      });

      var timelineHeight = wesCountry.getFullHeight(timelineContainer);
      timelineHeight = isNaN(timelineHeight) ? 30 : timelineHeight;

      mapContainerHeight -= timelineHeight;
    }
    else if (options.onChange)
    	options.onChange.call(this, times.length == 1 ? times[0] : null, 0);

    mapContainer.style.minHeight = mapContainerHeight + 'px';
    mapContainer.style.minWidth = mapContainerWidth + 'px';
    
    var last = times.length - 1;
    var mapData = [];

    for (var i = 0; i < times.length; i++) {
      var time = times[i];
      var list = countryList[time];

      mapData.push(list);

      // Only visible map is created, the rest is created on demand
      if (i < last) {
      	maps.push(null);
      	continue;
      }

      var map = new createOneMap(mapContainer, options, list, i == last);
      maps.push(map);
    }

    var selectedMap = maps[last];

    //this.render = function() {
    //  return selectedMap.render();
    //}

    this.getCountryInfo = function(countryCode) {
      return selectedMap.getCountryInfo(countryCode);
    }

    this.zoomToCountry = function(countryCode) {
      for (var i = 0; i < maps.length; i++)
        maps[i].zoomToCountry(countryCode);
    }

    this.visor = function() {
    	return selectedMap.visor();
    }

    return this;
  }

  function groupCountriesByTime(options) {
    var countries = options.countries;

	if (countries.length == 0)
		return {
			times: ["-"],
			countries: { "-": [] }
		};

    var times = [];
    var groupedCountries = {};

    for (var i = 0; i < countries.length; i++) {
      var country = countries[i];
      var code = country.code;
      var value = options.getValue(country);
      var time = country.time ? country.time : "-";

      if (times.indexOf(time) == -1) {
        times.push(time);
        groupedCountries[time] = [];
      }

      groupedCountries[time].push(country);
    }

    return {
      times: times,
      countries: groupedCountries
    };
  }

  function createOneMap(containerParent, options, countries, show) {
		var namespace = 'http://www.w3.org/2000/svg';

		// Country info visor
		var visor = null;
		this.visor = function() {
			return visor;
		}

		var svg = null;

		// g for every element
		var panel = null;

		// Zoom factor
		var factor = 1;
		var initialFactor = 1;

    var _svgWidth = null;
    var _svgHeight = null;

		// Translate position
		var translate = {
			x: 0,
			y: 0
		};

		var initialTranslate = {
			x: 0,
			y: 0
		};

		var fullCountryList = {};

    var container = null;

    this.showMap = function() {
      container.style.display = 'block';
    };

    this.hideMap = function() {
      container.style.display = 'none';
    }

		function init(containerParent, map, countries, show) {
		  container = createMap(containerParent, countries);
//
      if (!show)
        container.style.display = 'none';

			return map;
		};

    function createMap(containerParent, countries) {
      var container = document.createElement('div');
      container.className = 'wesCountry-map';

      containerParent.appendChild(container);

      // Height
      var height = containerParent.offsetHeight > 0 ? containerParent.offsetHeight : 300;
      
      // Width
      var width = containerParent.offsetWidth > 0 ? containerParent.offsetWidth : 300;

      _svgWidth = width;
      _svgHeight = height;

      // Zoom buttons
      if (options.zoom)
        createZoomButtons(container);

      getProjection();

      svg = document.createElementNS(namespace, "svg");
      var svgClassName = String.format('wesCountry-map-time-{0}', wesCountry.guid());
      svg.setAttributeNS(null, 'class', String.format("wesCountry {0}", svgClassName));
      svg.setAttributeNS(null, 'width', _svgWidth);
      svg.setAttributeNS(null, 'height', height);

      svg.setAttributeNS(null, 'viewBox',
          String.format('0 0 {0} {1}', _svgWidth, height));

      container.appendChild(svg);

      // Water

      var ocean = document.createElementNS(namespace, "rect");
      ocean.setAttributeNS(null, "class", "water");
      svg.appendChild(ocean);

      // Panel

      panel = document.createElementNS(namespace, "g");
      svg.appendChild(panel);

      // Styles

      var style = document.createElementNS(namespace, "style");
      style.setAttributeNS(null, 'type', 'text/css');
      svg.appendChild(style);

      var styleContent = String.format(".{0} .water { fill: {1}; width: 100%; height: 100%; }", svgClassName, options.backgroundColour);
      styleContent += String.format("\n.{0} .land { stroke: {1}; stroke-width: {2}; fill: {3}; }", svgClassName, options.borderColour, options.borderWidth, options.landColour);

      if (options.hoverColour) {
        styleContent += String.format("\n.{0} .land:hover { fill: {1}; }", svgClassName, options.hoverColour);
        styleContent += String.format("\n.{0} .land-group:hover, .{0} .land-group:hover g, .{0} .land-group:hover path { fill: {1}; }", svgClassName, options.hoverColour);
      }

      for (var i = 0; i < options.selectedRegions.length; i++) {
        var region = options.selectedRegions[i];
        styleContent += String.format("\n.{0} .region-{1} { fill: {2}; stroke: {3}; }", svgClassName, region, options.selectedRegionColour, options.selectedRegionBorderColour);
        styleContent += String.format("\n.{0} .region-{1}:hover { fill: {2}; stroke: {3}; }", svgClassName, region, options.hoverColour, options.selectedRegionBorderColour);
      }

      style.appendChild(document.createTextNode(styleContent));

      // Countries to highlight

      var countryList = getCountriesToShow(countries, style, svgClassName);

      // Country creation

      var regions = getCountriesByRegion();

      for (var r in regions) {
        if (regions[r].length == 0)
          continue;

        var regionName = regions[r][0].region.toLowerCase();

        var region = document.createElementNS(namespace, "g");
        region.setAttributeNS(null, "id", "region-" + regionName);
        region.setAttributeNS(null, "class", "region-" + regionName);
        panel.appendChild(region);

        for (var j = 0; j < regions[r].length; j++) {
          var country = regions[r][j];

          var element = null;

          if (country.path)
            element = createPath(country);

          if (country.elements)
            element = createGroup(country);

          if (element && options.onCountryClick)
            element.onclick = function() {
              if (this.id)
                options.onCountryClick.call(this, this.info);
            }

          if (element && options.onCountryOver)
            element.onmouseover = function() {
              if (this.id)
                options.onCountryOver.call(this, this.info, visor);
            }

          if (element && options.onCountryOut)
            element.onmouseout = function() {
              if (this.id)
                options.onCountryOut.call(this, this.info, visor);
            }

          if (element) {
            element.info = country;

            var value = countryList[element.id] ? options.getValue(countryList[element.id]) : null;

            element.info.value = value;

            fullCountryList[element.id] = element.info;
          }

          region.appendChild(element);
        }
      }

      var width = panel.getBoundingClientRect().width;
      var height = panel.getBoundingClientRect().height;

      // Water dimensions
      ocean.setAttributeNS(null, "width", width);
      ocean.setAttributeNS(null, "height", height);

      // Initial factor
      var svgWidth = containerParent.offsetWidth;

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

      // Signature

      var a = document.createElementNS(namespace, 'a');
      a.setAttributeNS(null, 'class', 'signature');
      a.setAttributeNS(null, 'href', wesCountry.signature.url);
      svg.appendChild(a);

      var text = document.createElementNS(namespace, 'text');
      text.setAttribute('x', containerParent.offsetWidth - 4);
      text.setAttribute('y', containerParent.offsetHeight - 8);
      text.setAttribute('style', 'fill:#aaa;font-family:Helvetica;font-size:10px;text-anchor: end;dominant-baseline: edge');
      text.textContent = wesCountry.signature.value;
      a.appendChild(text);

      return container;
    }

		function getCountriesByRegion() {
			// Cache
			if (options.projection.countriesByRegion)
				return options.projection.countriesByRegion;

			var countries = options.projection.countries;

			var regions = {};
			var empty = [];
			regions['empty'] = empty;

			for (var i = 0; i < countries.length; i++) {
				var country = countries[i];
				var region = country.region;

				if (!region)
					region = empty;
				else {
					if (!regions[region])
						regions[region] = [];

					region = regions[region];
				}

				region.push(country);
			}

			// Store in cache
			options.projection.countriesByRegion = regions;

			return regions;
		};

    //this.render = function() {
    //  return container;
    //}

		this.getCountryInfo = function(countryCode) {
			return fullCountryList[countryCode];
		}

		this.zoomToCountry = function(countryCode) {
			var country = svg.querySelector('#' + countryCode);

			if (!country)
				return;

			var countrySize = country.getBoundingClientRect();
			//var svgSize = svg.getBoundingClientRect();
      var svgSize = {
        width: _svgWidth,
        height: _svgHeight,
        left: svg.getBoundingClientRect().left,
        top: svg.getBoundingClientRect().top
      };

			widthFactor = svgSize.width / countrySize.width;
			heightFactor = svgSize.height / countrySize.height;

			if (widthFactor > heightFactor) {
				if (countrySize.height * widthFactor > svgSize.height)
					factor *= (svgSize.height / countrySize.height) * options.zoomToCountryFactor;
				else
					factor *= (svgSize.width / countrySize.width) * options.zoomToCountryFactor;
			}
			else {
				if (countrySize.width * heightFactor > svgSize.width)
					factor *= (svgSize.width / countrySize.width) * options.zoomToCountryFactor;
				else
					factor *= (svgSize.height / countrySize.height) * options.zoomToCountryFactor;
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
			var buttonContainer = document.createElement('div');
			buttonContainer.className = 'buttons';
			container.appendChild(buttonContainer);

			var buttons = document.createElement('div');
			buttons.className = 'zoom-buttons';
			buttonContainer.appendChild(buttons);

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

			var buttons = document.createElement('div');
			buttons.className = 'direction-buttons';
			buttonContainer.appendChild(buttons);

			// Up
			var up = document.createElement('button');
			up.innerHTML = '<img src="data:image/png;base64,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" />';
			up.className = 'button-up';

			buttons.appendChild(up);

			up.onclick = function() {
				if (factor > initialFactor) {
					translate.y += 100;
					updatePositionAndZoom();
				}
			}

			// Left
			var left = document.createElement('button');
			left.innerHTML = '<img src="data:image/png;base64,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" />';
			left.className = 'button-left';

			buttons.appendChild(left);

			left.onclick = function() {
				if (factor > initialFactor) {
					translate.x += 100;
					updatePositionAndZoom();
				}
			}

			// Right
			var right = document.createElement('button');
			right.innerHTML = '<img src="data:image/png;base64,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" />';
			right.className = 'button-right';

			buttons.appendChild(right);

			right.onclick = function() {
				if (factor > initialFactor) {
					translate.x -= 100;
					updatePositionAndZoom();
				}
			}

			// Down
			var down = document.createElement('button');
			down.innerHTML = '<img src="data:image/png;base64,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" />';
			down.className = 'button-down';

			buttons.appendChild(down);

			down.onclick = function() {
				if (factor > initialFactor) {
					translate.y -= 100;
					updatePositionAndZoom();
				}
			}
		}

		function getCountriesToShow(countries, style, className) {
			var valueList = [];

			for (var i = 0; i < countries.length; i++) {
				var value = options.getValue(countries[i]);

				if (valueList.indexOf(value) == -1)
					valueList.push(value);
			}

			var colours = wesCountry.colourRange(options.colourRange, valueList.length);

			valueList.sort(function(a, b){ return a - b });

			var valueColours = {};

			for (var i = 0; i < valueList.length; i++)
				valueColours[valueList[i]] = colours[i];

			var countryList = {};

			var styleContent = "";

			for (var i = 0; i < countries.length; i++) {
				var country = countries[i];
				var value = options.getValue(country);

				var colour = valueColours[value];

				countryList[country.code] = country;

				// Create CSS class to asign country colour
				styleContent += String.format("\n.{0} .{1}, .{0} .{1} g, .{0} .{1} path { fill: {2}; }", className, country.code, colour);
				styleContent += String.format("\n.{0} .{1}:hover, .{0} .{1}:hover g, .{0} .{1}:hover path { fill: {2}; opacity: 0.9; }", className, country.code, colour);
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

			if (element[options.countryCode])
				path.setAttributeNS(null, "id", element[options.countryCode]);

			if (!className) {
				className = 'land';

				if (element.region)
					className += ' region-' + element.region;
			}

			if (element[options.countryCode])
				className += ' ' + element[options.countryCode];

			path.setAttributeNS(null, "class", className);

			path.setAttributeNS(null, "d", element.path);

			if (element.transform)
				path.setAttributeNS(null, 'transform', element.transform);

			return path;
		}

		function createGroup(element, className) {
			var g = document.createElementNS(namespace, "g");
			g.setAttributeNS(null, "id", element[options.countryCode]);

			if (element.transform)
				g.setAttributeNS(null, 'transform', element.transform);

			if (!className && element[options.countryCode])
				className = 'land';

			if (className) {
				var c = className;

				c += ' land-group'

				if (element[options.countryCode])
					c += ' ' + element[options.countryCode];

				if (element.region)
					className += ' region-' + element.region;

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

		return new init(containerParent, this, countries, show);
	}
})();

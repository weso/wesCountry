if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.loader = new (function() {
	var defaultOptions = {
		container: "body",
		callback: function() {
		  console.log('ready');
		},
    cache: false,
		getChartData: function(options, data) {
			return defaultOptions;
		}
	};

  var lastData = null;

  this.renderChart = function(options) {
    var panel = document.createElement('div');
    panel.id = 'c' + wesCountry.guid();

    var container = document.querySelector(options.container);
    container.appendChild(panel);

    options.callback = function(data, options) {
      lastData = data;
      options.container = '#' + panel.id;

      options = options.getChartData ? options.getChartData(options, data) : options;
      var charts = wesCountry.charts.multiChart(options);

      if (options.afterRenderCharts)
      	options.afterRenderCharts.call(null, charts);
    }

    return this.render(options, panel);;
  }

	this.render = function(options, panel)
	{
		return new (function () {
			this.options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

			var container = document.querySelector(this.options.container);

			this.options.width = this.options.width ? this.options.width : container.offsetWidth;
			this.options.height = this.options.height ? this.options.height : container.offsetHeight;

			this.options.width = this.options.width > 0 ? this.options.width : 500;
			this.options.height = this.options.height > 0 ? this.options.height : 400;

      var panelContainer = panel;

      if (!panel) {
        panelContainer = document.createElement('div');
        container.appendChild(panelContainer);
      }

      this.panel = panelContainer;

			this.panel.className = 'wesCountry-panel';
      var height = wesCountry.getFullHeight(container);
      height = isNaN(height) ? this.options.height : height;

			this.panel.setAttribute("style", String.format("width: {0}px; min-height: {1}px;",
										  this.options.width, height));

		  //container.appendChild(this.panel);
      container.panel = this.panel;

      // Resize
      if (window.attachEvent)
        window.attachEvent('resize', resize);
      else
        window.addEventListener('resize', resize, false);

		  this.load = load;

		  this.load(this.options);

      function resize() {
        var height = wesCountry.getFullHeight(container);
        height = isNaN(height) ? this.options.height : height;

        panelContainer.setAttribute("style", String.format("width: {0}px; min-height: {1}px;",
                        container.offsetWidth, height));
      }

		  this.getData = function() {
  			return lastData;
  		  }

  		  this.show = function() {
  		  	container.style.display = 'block';
  		  }

  		  this.hide = function() {
  		  	container.style.display = 'none';
  		  }
		})();
	}

  function load(options) {
    options = wesCountry.mergeOptionsAndDefaultOptions(options, this.options);
    var interval = showLoading(this.panel, options);

    var panel = this.panel;

  	if (options.url)
  		wesCountry.ajax.load({
  		  url: options.url,
  		  parameters: options.parameters ? options.parameters : "",
          cache_enabled: options.cache ? true : false,
  		  callback: function(data) {
  		    lastData = data;

  			  panel.innerHTML = '';

  			  if (options.callback)
  			     options.callback.call(null, data, options);

  			  clearInterval(interval);
  		  }
  		});
  }

  function showLoading(container, options) {
    var animation = document.createElement('div');
    animation.className = 'loading';
    container.appendChild(animation);

    var circles = [];

    for (var i = 0; i < 3; i++) {
      var circle = document.createElement('div');
      circle.className = 'loading-circle';
      animation.appendChild(circle);

      circles.push(circle);

      var width = wesCountry.getCssProperty(circle, 'width');
      circle.style.height = width;

      var circleHeight = circle.offsetHeight;
      var innerCircleHeigth = circleHeight / 1.5;
      var innerCircleMargin = (circleHeight - innerCircleHeigth) / 2;

      var innerCircle = document.createElement('div');
      innerCircle.className = 'loading-inner-circle';
      innerCircle.style.width = innerCircle.style.height = innerCircleHeigth + 'px';
      innerCircle.style.marginTop = innerCircleMargin + 'px';
      circle.appendChild(innerCircle);
    }

    var containerHeight = wesCountry.getFullHeight(container);
    var loadingHeight = wesCountry.getFullHeight(animation);

    animation.style.top = (containerHeight / 2 - loadingHeight / 2) + 'px';

    var index = 0;
    var lastIndex = 0;

    var interval = setInterval(function() {
      index++;

      if (index > 2)
        index = 0;

      circles[lastIndex].className = 'loading-circle';
      circles[lastIndex].style.backgroundColor = 'transparent';
      circles[index].className = 'loading-circle loading-circle-active';

      lastIndex = index;
    }, 400);

    return interval;
  }
})();

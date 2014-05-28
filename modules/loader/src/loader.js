if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.loader = new (function() {
	var defaultOptions = {
		container: "body",
		width: 500,
		height: 400,
    loading: {
      colour: "#888"
    },
    callback: function() {
      console.log('ready');
    }
	};

  this.renderChart = function(options) {
    var panel = document.createElement('div');
    panel.id = 'c' + wesCountry.guid();

    options.callback = function() {
      options.container = '#' + panel.id;
      wesCountry.charts.chart(options);
    }

    return this.render(options, panel);
  }

	this.render = function(options, panel)
	{
    return new (function () {
  		this.options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

  		var container = document.querySelector(this.options.container);

  		this.panel = panel ? panel : document.createElement('div');

  		this.panel.className = 'wesCountry-panel';
  		this.panel.setAttribute("style", String.format("width: {0}px; height: {1}px;",
                                      this.options.width, this.options.height));

      container.appendChild(this.panel);

      this.load = load;

      this.load(this.options);
    })();
	}

  function load(options) {
    options = wesCountry.mergeOptionsAndDefaultOptions(options, this.options);
    var interval = showLoading(this.panel, options);

    var panel = this.panel;

    wesCountry.ajax.load({
      url: options.url,
      callback: function(data) {
        clearInterval(interval);

        panel.innerHTML = '';

        if (options.callback)
          options.callback.call(null, data);
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
      innerCircle.style.backgroundColor = options.loading.colour;
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
      circles[index].style.backgroundColor = options.loading.colour;

      lastIndex = index;
    }, 400);

    return interval;
  }
})();

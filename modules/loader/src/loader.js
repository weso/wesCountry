if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.loader = new (function() {
	var defaultOptions = {
		container: "body",
		width: 500,
		height: 300,
    loading: {
      colour: "#2EFE64"
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
    container.appendChild(animation);

    var chartOptions = {
      width: options.width,
      height: options.height,
      legend: {
        show: false
      },
      xAxis: {
        values: []
      },
      margins: [30, 0, 30, 0],
      series: [
        {
          values: [0]
        },
        {
          values: [100]
        }
      ],
      valueOnItem: {
        show: false
      },
      serieColours: [options.loading.colour, "#fff"]
    };

    var cont1 = -1;
    var cont2 = 101;

    var interval = setInterval(function() {
      chartOptions.series[0].values[0] = ++cont1;
      chartOptions.series[1].values[0] = --cont2;

      if (cont2 == 0) {
        cont1 = -1;
        cont2 = 101;
        chartOptions.serieColours = chartOptions.serieColours.reverse();
      }

      animation.innerHTML = '';

      var chart = wesCountry.charts.donutChart(chartOptions);
      animation.appendChild(chart.render());
    }, 5);

    return interval;
  }
})();

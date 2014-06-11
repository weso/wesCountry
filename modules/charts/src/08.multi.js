NodeList.prototype.indexOf = function (element) {
	for(var i=0;i<this.length;i++) {
		if(this[i] == element)
			return i;
	} return -1;
};

////////////////////////////////////////////////////////////////////////////////
//                                  TABLE
////////////////////////////////////////////////////////////////////////////////

wesCountry.charts.table = function(options) {
	options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);

	var table = document.createElement('table');
	table.className = 'wesCountry';

	var thead = document.createElement('thead');
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	var tr = document.createElement('tr');
	thead.appendChild(tr);

	var th = document.createElement('th');
	th.innerHTML = 'Country';
	tr.appendChild(th);

	var th = document.createElement('th');
	th.innerHTML = 'Time';
	tr.appendChild(th);

	var th = document.createElement('th');
	th.innerHTML = 'Value';
	tr.appendChild(th);

	for (var i = 0; i < options.series.length; i++) {
		var country = options.series[i].name;

		for (var j = 0; j < options.xAxis.values.length; j++) {
			var value = options.series[i].values[j];
			var time = options.xAxis.values[j];

			var tr = document.createElement('tr');
			tbody.appendChild(tr);

			var td = document.createElement('td');
			td.innerHTML = country;
			tr.appendChild(td);

			var td = document.createElement('td');
			td.innerHTML = time;
			tr.appendChild(td);

			var td = document.createElement('td');
			td.innerHTML = value;
			tr.appendChild(td);
		}
	}

	return {
		render: function() {
			return table;
		}
	};
}

////////////////////////////////////////////////////////////////////////////////
//                                  CHART
////////////////////////////////////////////////////////////////////////////////

function getCountriesForMap(options) {
	var countryData = [];
	var countries = [];

	for (var i = options.series.length - 1; i >= 0; i--) {
		var countryName = options.series[i].name;
		var countryId = options.series[i].id ? options.series[i].id : countryName;

		if (countries.indexOf(countryId) != -1)
			continue;

		countries.push(countryId);

		for (var j = 0; j < options.xAxis.values.length; j++) {
			var value = options.series[i].values[j];
			var time = options.xAxis.values[j];

			if (value) {
				countryData.push({
					code: countryId,
					value: value,
					time: time
				});

				break;
			}
		}
	}

	return countryData;
}

wesCountry.charts.chart = function (options) {
	var downloadFormats = ['JSON', 'XML', 'CSV'];
	var defaultOptions = {
		"download": false,
		"downloadFormats": downloadFormats
	}

	var container;
	container = typeof options.container !== "string" ? options.container : undefined;
	options.container = typeof options.container === "string" ? options.container : wesCountry.charts.defaultOptions.container;

	if(container === undefined)
		container = document.querySelector(options.container);

	if (!container)
		container = document.body;

	if (!options.width && container.offsetWidth > 0 )
		options.width = container.offsetWidth;

	if (!options.height && container.offsetHeight > 0 )
		options.height = container.offsetHeight;

	var dOptions = wesCountry.clone(wesCountry.charts.defaultOptions);
	dOptions = wesCountry.addOptions(dOptions, defaultOptions);
	options = wesCountry.mergeOptionsAndDefaultOptions(options, dOptions);

	// Height

	//var height = options.height;
	var height = wesCountry.getFullHeight(container);

	// Title

	if (options.title != '') {
		var title = document.createElement('p');
		title.className = 'wesCountry-title';
		title.innerHTML = options.title;
		container.appendChild(title);

		height -= wesCountry.getFullHeight(title);
	}

	// Body (graph)

	var body = document.createElement('div');
	body.className = 'wesCountry-body';
	container.appendChild(body);

	var footer = document.createElement('div');
	footer.className = 'wesCountry-footer';

	var isFooted = false;

	// Foot

	if (options.foot != '') {
		container.appendChild(footer);

		var foot = document.createElement('p');
		foot.className = 'wesCountry-foot';
		foot.innerHTML = options.foot;
		footer.appendChild(foot);

		isFooted = true;
	}

	// Download

	var downloadButtons = null;

	if (options.download) {
		if (!options.foot)
			container.appendChild(footer);

		downloadButtons = createDownload(footer, options, downloadFormats);

		isFooted = true;
	}

	if  (isFooted)
		height -= wesCountry.getFullHeight(footer);

	// Chart

	options.height = height;

	body.style.height = height + 'px';

	var chart = getChart(options, body);

	if (downloadButtons)
		linkDownloadButtons(downloadButtons, chart, options)

	// Append chart

	if (chart && chart.render)
		body.appendChild(chart.render());

	return chart;
}

function linkDownloadButtons(downloadButtons, chart, options) {
	var data = getDataToDownload(chart, options);

	for (var i = 0; i < downloadButtons.length; i++) {
		var button = downloadButtons[i];
		var format = button.format;
		var datum = data[format];

		button.button.href = String.format("data:text/{0};charset=utf-8,{1}", format, encodeURIComponent(datum));
	}
}

function createDownload(container, options, downloadFormats) {
		var buttons = [];

		for (var i = 0; i < downloadFormats.length; i++) {
			var format = downloadFormats[i];

			if (options.downloadFormats.indexOf(format) == -1)
			 	continue;

			var a = document.createElement('a');
			a.className = String.format('wesCountry-download format-{0}', format);
			a.innerHTML = format;
			a.download = String.format("data.{0}", format);
			a.target = "_blank";

			container.appendChild(a);

			buttons.push({
				format: format,
				button: a
			});
		}

		return buttons;
}

function getDataToDownload(chart, options) {
	var jsonData = getJSON(chart, options);
	var xmlData = getXML(jsonData);
	var csvData = getCSV(jsonData);

	return {
		JSON: JSON.stringify(jsonData),
		XML: xmlData,
		CSV: csvData
	}
}

function getJSON(chart, options) {
	var chartType = options.chartType ? options.chartType.toLowerCase() : "bar";

	var elements = [];

	if (chartType == "map") {
		var countries = options.countries ? options.countries : [];

		for (var i = 0; i < countries.length; i++) {
			var country = countries[i];
			var value = countries[i].value;
			var countryInfo = chart.getCountryInfo(country.code);

			if (!countryInfo)
				continue;

			countryInfo.value = value;

			elements.push(countryInfo);
		}
	}
	else if (chartType == "scatter") {
		var moment1 = options.xAxis.values[0] ? options.xAxis.values[0] : "Moment 1";
		var moment2 = options.xAxis.values[1] ? options.xAxis.values[1] : "Moment 2";

		for (var i = 0; i < options.series.length; i++) {
			var serie = options.series[i].name;
			var values = options.series[i].values;
			for (var j = 0; j < values.length; j++) {
				var value1 = values[0];
				var value2 = values[1];

				var data = {
					"serie": serie
				};

				data[moment1] = value1;
				data[moment2] = value2;

				elements.push(data);
			}
		}
	}
	else {
		for (var i = 0; i < options.series.length; i++) {
			var serie = options.series[i].name;
			var values = options.series[i].values;
			for (var j = 0; j < options.xAxis.values.length; j++) {
				var value = values[j] ? values[j] : "";
				var moment = options.xAxis.values[j];

				elements.push({
					"serie": serie,
					"moment": moment,
					"value": value
				});
			}
		}
	}

	return elements;
}

function getXML(json) {
  var data = '';

	for (var i = 0; i < json.length; i++) {
		var element = json[i];
		var elementData = '';

		for (var key in element) {
			var value = element[key];
			elementData += String.format('<{0}>{1}</{0}>', key, value);
		}

		data += String.format('<element>{0}</element>', elementData);
	}

	return String.format('<?xml version="1.0" encoding="UTF-8" ?><elements>{0}</elements>', data);
}

function getCSV(json) {
	var array = typeof json != 'object' ? JSON.parse(json) : json;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';

		for (var index in array[i]) {
      if (line != '')
				line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function getChart(options, container) {
	var chartType = options.chartType ? options.chartType.toLowerCase() : "bar";

	var chart = null;

	switch(chartType) {
		case "bar":
			chart = wesCountry.charts.barChart(options);
			break;
		case "line":
			chart = wesCountry.charts.lineChart(options);
			break;
		case "pie":
			chart = wesCountry.charts.pieChart(options);
			break;
		case "donut":
			chart = wesCountry.charts.donutChart(options);
			break;
		case "area":
			chart = wesCountry.charts.areaChart(options);
			break;
		case "scatter":
			chart = wesCountry.charts.scatterPlot(options);
			break;
		case "polar":
			chart = wesCountry.charts.polarChart(options);
			break;
		case 'table':
			chart = wesCountry.charts.table(options);
			break;
		case 'stacked':
			chart = wesCountry.charts.stackedChart(options);
			break;
		case 'ranking':
			chart = wesCountry.charts.rankingChart(options);
			break;
		case 'map':
			var innerContainer = document.createElement('div');
			innerContainer.id = String.format("map-wrapper-{0}", wesCountry.guid());
			innerContainer.style.height = options.height + 'px';

			//container = document.querySelector(options.container);
			container.appendChild(innerContainer);

			options.container = String.format("#{0}", innerContainer.id);
			options.countries = options.countries ? options.countries : getCountriesForMap(options);

			chart = wesCountry.maps.createMap(options);
			break;
	}

	return chart;
}

////////////////////////////////////////////////////////////////////////////////
//                                MULTI CHART
////////////////////////////////////////////////////////////////////////////////
/*var optionsSave = [];
var pushIndex = optionsSave.length;
wesCountry.charts.multiChartRemoveData = function (from, numberOf) {
	optionsSave.splice(from, numberOf);
};

wesCountry.charts.setPushIndex = function (index) {
	if(index === "length") {
		pushIndex = optionsSave.length;
	} else {
		pushIndex = index;
	}
};
*/
wesCountry.charts.multiChart = function (options) {
	var defaultOptions = {
		chartType: ['line']
	}

	options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

	if (typeof options.chartType === "string") {
		return [wesCountry.charts.chart(options)];
	}

	var chartTypes = options.chartType;
	var container = document.querySelector(options.container);

	var chartSelector = document.createElement('div');
	chartSelector.className = "chart-selector";
	container.appendChild(chartSelector);

	var buttons = createChartSelector(chartSelector);

	var chartContainer = document.createElement('div');
	chartContainer.className = 'chart-container';
	chartContainer.style.height = (container.offsetHeight - chartSelector.offsetHeight) + 'px';
	container.appendChild(chartContainer);

	return createCharts(chartContainer, buttons);

	function createChartSelector(container) {
		var buttons = [];

		var div = document.createElement('div');
		container.appendChild(div);

		var ul = document.createElement('ul');
		div.appendChild(ul);

		var length = chartTypes.length;

		for (var i = 0; i < length; i++) {
			var type = chartTypes[i];

			var li = document.createElement('li');
			li.type = type;
			li.chart = null;
			li.className = i == 0 ? 'button-active' : 'button-inactive';
			ul.appendChild(li);

			var a = document.createElement('a');
			a.type = type;
			a.innerHTML = type;
			li.appendChild(a);

			a.onclick = function() {
				var ul = this.parentNode.parentNode;

				var buttons = ul.childNodes;

				var length = buttons.length;

				for (var i = 0; i < length; i++) {
					var button = buttons[i];

					// Set button
					button.className = 'button-inactive';

					// Set chart
					button.chart.style.display = 'none';
				}

				// Set button
				var button = this.parentNode;
				button.className = 'button-active';

				// Set chart
				button.chart.style.display = 'block';
			}

			buttons.push(li);
		}

		return buttons;
	}

	function createCharts(container) {
		var length = chartTypes.length;

		var charts = [];

		for (var i = 0; i < length; i++) {
			var type = chartTypes[i];

			var id = String.format("chart-{0}", wesCountry.guid());

			var chartContainer = document.createElement('div');
			chartContainer.id = id;
			chartContainer.style.height = wesCountry.getFullHeight(container) + 'px';
			container.appendChild(chartContainer);

			buttons[i].chart = chartContainer;

			var chartOptions = wesCountry.clone(options);
			chartOptions.chartType = type;
			chartOptions.container = String.format("#{0}", id);

			var chart = wesCountry.charts.chart(chartOptions);

			charts.push(chart);

			// Is set after rendering the chart (if not height is not obteined properly)
			chartContainer.style.display = (i == 0) ? 'block' : 'none';
		}

		return charts;
	}
};

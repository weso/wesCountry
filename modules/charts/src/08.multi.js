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
			
			if (value) {
				countryData.push({
					code: countryId,
					value: value
				});
				
				break;
			}
		}
	}
	
	return countryData;
}

wesCountry.charts.chart = function (options) {
	var container;
	container = typeof options.container !== "string" ? options.container : undefined;
	options.container = typeof options.container === "string" ? options.container : wesCountry.charts.defaultOptions.container; 
	options = wesCountry.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
	var chart;
	
	var chartType = options.chartType ? options.chartType.toLowerCase() : "bar";
	
	switch(chartType) {
		case "bar":
			chart = this.barChart(options);
			break;
		case "line":
			chart = this.lineChart(options);
			break;
		case "pie":
			chart = this.pieChart(options);
			break;
		case "area":
			chart = this.areaChart(options);
			break;
		case "scatter":
			chart = this.scatterPlot(options);
			break;
		case "polar":
			chart = this.polarChart(options);
			break;
		case 'table':
			chart = this.table(options);
			break;
		case 'map':
			chart = wesCountry.maps.createMap({
				container: options.container,
				countries: getCountriesForMap(options)
			});
			break;
	}
	
	if(container === undefined)
		container = document.querySelector(options.container);
	
	if (chart.render)	
		container.appendChild(chart.render());
	
	return container.parentNode;
}

////////////////////////////////////////////////////////////////////////////////
//                                MULTI CHART
////////////////////////////////////////////////////////////////////////////////
var optionsSave = [];
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

wesCountry.charts.multiChart = function (optionsReceived, newGraphic, element) {
	var containerReceived = optionsReceived.container;
	optionsReceived.container = "body";
	options = wesCountry.mergeOptionsAndDefaultOptions(optionsReceived, wesCountry.charts.defaultOptions);
	options.container = containerReceived;
	optionsReceived.container = containerReceived;
	if(newGraphic || newGraphic === undefined) {
		var optionsToSave = wesCountry.clone(options);
		optionsToSave.xAxis = wesCountry.clone(options.xAxis);
		optionsSave.splice(pushIndex, 0, optionsToSave);
		wesCountry.charts.setPushIndex("length");
	} else {
		var index = getIndexOfElement(element);
		optionsSave[index].series = wesCountry.clone(options.series);
		options.xAxis = wesCountry.clone(options.xAxis);
	}
	var charts = options.chartType;
	charts = charts instanceof Array ? charts : [charts]; //if not array convert to array
	var container = document.createElement("div");
	if(typeof options.container === "string")
		document.querySelector(options.container).appendChild(container);
	else 
		options.container.appendChild(container);
	createChartSelector();
	createSeriesSelector();
	return createChart();

	function createChartSelector() {	
		var div = document.createElement('div');
		div.className = "chartSelector";
		var ul = document.createElement('ul');
		for(var i=0; i<charts.length;i++) {
			var li = document.createElement('li');	
			var a = document.createElement('a');
			//a.href="#";
			a.className ="inactive";
			a.onclick = onGraphSelected;
			a.innerHTML = charts[i].toFirstUpperCase();
			li.appendChild(a);
			ul.appendChild(li);
		}
		div.appendChild(ul);
		div.querySelector("li a").className= "active";
		container.appendChild(div);
		
		if (charts.length <= 1)
			div.style.display = "none";
	}

	function createSeriesSelector() {
		var div = document.createElement('div');
		div.className = "seriesSelector";
		for(var i=0; i<options.series.length;i++) {
			var input = document.createElement('input');
			var label = document.createElement('label');
			input.id = options.series[i].name + "Checkbox" + wesCountry.charts.guid();
			input.type = "checkbox";
			input.className = "checks";
			input.onchange = onSeriesChanged;
			input.checked = true;
			label.for = input.id;
			label.innerHTML = options.series[i].name;
			div.appendChild(input);
			div.appendChild(label);
		} container.appendChild(div);
	}

	function createChart() {
		var div = document.createElement('div');
		div.className = "chartDiv";
		container.appendChild(div);
		return showChart(div);
	}

	function showChart(div) {
		var typeOfGraph = "bar";
		
		var active = container.querySelector(".active");
		
		if (active && active.innerHTML)
			typeOfGraph = active.innerHTML.toLowerCase();
			
		options.chartType = typeOfGraph;
		if(div === undefined)
			options.container = ".chartDiv";
		else
			options.container = div;
		return wesCountry.charts.chart(options);
	}

	function loadGraph(div) {
		//remove previous chart
		div.querySelector(".chartDiv").innerHTML="";	
		showChart(div.querySelector(".chartDiv"));
	}

	function setSelectedGraphToActive(name, ul) {
		var active = ul.querySelector(".active");
		var inactives = ul.querySelectorAll(".inactive");
		var length = inactives.length;
		for(var i=0;i<length;i++) 
			if(name===inactives[i].innerHTML) 
				inactives[i].className="active";
			else 
				inactives[i].className="inactive";

		if(name!==active.innerHTML)
			active.className="inactive";
	}

	function onGraphSelected() {
		setSelectedGraphToActive(this.innerHTML, this.parentNode.parentNode);
		var div = this.parentNode.parentNode.parentNode.parentNode;
		var recovered = recoverSeriesAndXValuesItem(this.parentNode.parentNode);
		options.series = recovered.series;
		options.xAxis.values = recovered.xAxisValues;
		loadGraph(div);
	}

	function onSeriesChanged() {
		var seriesAndXAxisValues = recoverSeriesAndXValuesItem(this);
		var checkBoxes = this.parentNode.querySelectorAll("input");
		var length = seriesAndXAxisValues.series.length;
		for(var i=0;i<length;i++) 
			if(!checkBoxes[i].checked)
				delete seriesAndXAxisValues.series[i];
		optionSeriesWithoutUndefined();
		putXAxisValuesOnOptions();
		loadGraph(this.parentNode.parentNode); //div of the grap

		function putXAxisValuesOnOptions() {
			options.xAxis.values = seriesAndXAxisValues.xAxisValues;
		} 

		function optionSeriesWithoutUndefined() {
			var seriesReturned = [];
			for(var i=0;i<length;i++) 
				if(seriesAndXAxisValues.series[i] !== undefined)
					seriesReturned.push(seriesAndXAxisValues.series[i]);
			options.series = seriesReturned;
		}
	}

	function recoverSeriesAndXValuesItem(element) {
			var index = getIndexOfElement(element);
			return {
				series: wesCountry.clone(optionsSave[index].series),
				xAxisValues: wesCountry.clone(optionsSave[index].xAxis.values)
			};
	}

	function getIndexOfElement(element) {
		var parent = element.parentNode; //get a div
		var allDivs = document.querySelectorAll("."+parent.className);
		return allDivs.indexOf(parent);
	}
};

NodeList.prototype.indexOf = function (element) {
	for(var i=0;i<this.length;i++) {
		if(this[i] == element)
			return i;
	} return -1;
};
////////////////////////////////////////////////////////////////////////////////
//                                  CHART
////////////////////////////////////////////////////////////////////////////////	
wesCountry.charts.chart = function (options) {
	var container;
	container = typeof options.container !== "string" ? options.container : undefined;
	options.container = typeof options.container === "string" ? options.container : wesCountry.charts.defaultOptions.container; 
	options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
	var chart;
	switch(options.chartType.toLowerCase()) {
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
	}
	if(container === undefined)
		container = document.querySelector(options.container);
	container.appendChild(chart.render());
	return container.parentNode;
}
////////////////////////////////////////////////////////////////////////////////
//                                MULTI CHART
////////////////////////////////////////////////////////////////////////////////
var graphicsItemsSave = {
	series: [],
	xAxisValues: []
};
wesCountry.charts.multiChart = function (options, newGraphic, element) {
	options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
	if(newGraphic || newGraphic === undefined) {
		graphicsItemsSave.series.push(wesCountry.charts.clone(options.series));
		graphicsItemsSave.xAxisValues.push(wesCountry.charts.clone(options.xAxis.values));
	} else {
		var index = getIndexOfElement(element);
		graphicsItemsSave.series[index] = wesCountry.charts.clone(options.series);
		graphicsItemsSave.xAxisValues[index] = wesCountry.charts.clone(options.xAxis.values);
	}
	var charts = options.chartType;
	charts = charts instanceof Array ? charts : [charts]; //if not array convert to array
	var container = document.createElement("div");
	document.querySelector(options.container).appendChild(container);
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
		var typeOfGraph = container.querySelector(".active").innerHTML.toLowerCase();
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

		function recoverSeriesAndXValuesItem(element) {
			var index = getIndexOfElement(element);
			return {
				series: wesCountry.charts.clone(graphicsItemsSave.series[index]),
				xAxisValues: wesCountry.charts.clone(graphicsItemsSave.xAxisValues[index])
			};
		}
	}

	function getIndexOfElement(element) {
		var parent = element.parentNode; //get a div
		var allDivs = document.querySelectorAll("."+parent.className);
		return allDivs.indexOf(parent);
	}
};

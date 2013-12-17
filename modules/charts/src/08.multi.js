////////////////////////////////////////////////////////////////////////////////
//                                  CHART
////////////////////////////////////////////////////////////////////////////////	
wesCountry.charts.chart = function (options) {
	var container;
	container = typeof options.container !== "string" ? options.container : undefined;
	options.container = typeof options.container === "string" ? options.container : wesCountry.charts.defaultOptions.container; 
	options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
	var chart;
	switch(options.chartType) {
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
wesCountry.charts.multiChart = function (options) {
	options = wesCountry.charts.mergeOptionsAndDefaultOptions(options, wesCountry.charts.defaultOptions);
	seriesSave = wesCountry.charts.clone(options.series);
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
		for(var i=0; i<seriesSave.length;i++) {
			var input = document.createElement('input');
			var label = document.createElement('label');
			input.id = seriesSave[i].name + "Checkbox" + wesCountry.charts.guid();
			input.type = "checkbox";
			input.className = "checks";
			input.onchange = onSeriesChanged;
			input.checked = true;
			label.for = input.id;
			label.innerHTML = seriesSave[i].name;
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
		var series = wesCountry.charts.clone(seriesSave);
		var checkBoxes = this.parentNode.querySelectorAll("input");
		var length = series.length;
		for(var i=0;i<length;i++) 
			if(!checkBoxes[i].checked)
				delete series[i];
		optionSeriesWithoutUndefined();
		loadGraph(this.parentNode.parentNode); //div of the grap

		function optionSeriesWithoutUndefined() {
			var seriesReturned = [];
			for(var i=0;i<length;i++) 
				if(series[i] !== undefined)
					seriesReturned.push(series[i]);
			options.series = seriesReturned;
		}
	}
}
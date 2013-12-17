////////////////////////////////////////////////////////////////////////////////
//                                  CHART
////////////////////////////////////////////////////////////////////////////////	
wesCountry.charts.chart = function (options) {
	options = mergeOptionsAndDefaultOptions(options, defaultOptions);
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
	document.querySelector(options.container).appendChild(chart.render());
}

////////////////////////////////////////////////////////////////////////////////
//                                MULTI CHART
////////////////////////////////////////////////////////////////////////////////
wesCountry.charts.multiChart = function (options) {
	options = mergeOptionsAndDefaultOptions(options, defaultOptions);
	seriesSave = clone(options.series);
	var charts = options.chartType;
	charts = charts instanceof Array ? charts : [charts]; //if not array convert to array
	var container = document.querySelector(options.container);
	createChartSelector();
	createSeriesSelector();
	createChart();

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
			input.id = seriesSave[i].name + "Checkbox" + guid();
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
		showChart();
	}

	function showChart() {
		var typeOfGraph = container.querySelector(".active").innerHTML.toLowerCase();
		options.chartType = typeOfGraph;
		options.container = ".chartDiv";
		jGraf.chart(options);
	}

	function loadGraph(graphName) {
		//remove previous chart
		document.querySelector(".chartDiv").innerHTML="";	

		showChart();
	}

	function setSelectedGraphToActive(name) {
		var active = document.querySelector(".active");
		var inactives = document.querySelectorAll(".inactive");
		var length = inactives.length;
		for(var i=0;i<length;i++) 
			if(name===inactives[i].innerHTML) 
				inactives[i].className="active";
			else 
				inactives[i].className="inactive";

		if(name!==active.innerHTML)
			active.className="inactive";
	}

	function changeGraph() {
		var graphName = document.querySelector(".active").innerHTML;
		loadGraph(graphName);
	}

	function onGraphSelected() {
		setSelectedGraphToActive(this.innerHTML);
		changeGraph();
	}

	function onSeriesChanged() {
		var series = clone(seriesSave);
		var checkBoxes = document.querySelectorAll(".seriesSelector input");
		var length = series.length;
		for(var i=0;i<length;i++) 
			if(!checkBoxes[i].checked)
				delete series[i];
		optionSeriesWithoutUndefined();
		changeGraph();

		function optionSeriesWithoutUndefined() {
			var seriesReturned = [];
			for(var i=0;i<length;i++) 
				if(series[i] !== undefined)
					seriesReturned.push(series[i]);
			options.series = seriesReturned;
		}
	}
}
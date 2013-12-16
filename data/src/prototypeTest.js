var info = [
{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"243.951870842302", "dataset":""},
{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"309.008997833499", "dataset":"World Bank"},
{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"326.585848270781", "dataset":"World Bank"},
{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"256.268026665139", "dataset":"World Bank"},
{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"222.458534003048", "dataset":"World Bank"},
{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"430.564095118456", "dataset":"World Bank"},
{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"106.145003684811", "dataset":"World Bank"},
{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"89.1699567127999", "dataset":"World Bank"},
{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"117.185367443222", "dataset":"World Bank"}
];

/*var series = {
	serie0: {
	name: "Primero",
	values: [-1, 4, 5, 3, 6],
	urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
},

serie1: {
	name: "Segundo",
	values: [1, 7, 5, 6, 4],
	urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
},

serie2: {
	name: "Tercero",
	values: [0, 1, 2, 3, 4],
	urls: ["http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es", "http://www.google.es"]
}}; */

var optionSeries = data.jsonParse(info);

var optionsDefault = {
	series: [],
	xAxis: {
			title: "Years",
			values: ["2007", "2008", "2009"]
	}
};

var color1 = "#3289c7";
var color2 = "#eb0000";

$( document ).ready(function() {
	$('#picker1').colpick({
	flat:true,
	layout:'hex',
	submit:0,
	color: color1,
	onChange: function(hsb, hex, rgb) {
		color1 = hex;
	}
	});
	$('#picker2').colpick({
	flat:true,
	layout:'hex',
	submit:0,
	color: color2,
	onChange: function(hsb, hex, rgb) {
		color2 = hex;
	}
	});
});

function loadGraph(graphName, options) {
	//remove previous chart
	document.getElementById("divGraph").innerHTML="";

	//paint new graph
	var chart;
	switch(graphName) {
		case "line":
			chart = jGraf.lineChart(options);
			break;
		case "bar":
			chart = jGraf.barChart(options);
			break;
		case "pie":
			chart = jGraf.pieChart(options);
			break;
		case "area":
			chart = jGraf.areaChart(options);
			break;
	}
	document.getElementById("divGraph").appendChild(chart.render());
}

function onSeriesChanged() {
	var options = JSON.parse(JSON.stringify(optionsDefault));
	var select1 = document.getElementById("comboOpcion1");
	var select2 = document.getElementById("comboOpcion2");
	options.series.push(optionSeries.series[select1.selectedIndex]);
	options.series.push(optionSeries.series[select2.selectedIndex]);
	var colors = document.querySelectorAll(".colorText");
	options.serieColours = [color1, color2];
	var typeGraphCombo = document.querySelector("#typeSelector");
	var graphName = typeGraphCombo.options[typeGraphCombo.selectedIndex].value;
	loadGraph(graphName, options);
}



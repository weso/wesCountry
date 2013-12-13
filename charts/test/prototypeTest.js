var series = {
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
}};

var optionsDefault = {
	series: []
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
	options.series.push(series["serie"+select1.selectedIndex]);
	options.series.push(series["serie"+select2.selectedIndex]);
	var colors = document.querySelectorAll(".colorText");
	options.serieColours = [color1, color2];
	var typeGraphCombo = document.querySelector("#typeSelector");
	var graphName = typeGraphCombo.options[typeGraphCombo.selectedIndex].value;
	loadGraph(graphName, options);
}



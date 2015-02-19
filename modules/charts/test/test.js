window.onload = function() {
	generateLinks([
		"line",
		"area",
		"bar",
		"stacked",
		"pie",
		"donut",
		"polar",
		"scatter",
		"ranking"
	]);

	var options = {
		style: "border: 1px solid red",
		width: 500,
		height: 500
	}

	generateCharts(options);
}

function generateLinks(links) {
	var length = links.length;

	for (var i = 0; i < length; i++) {
		var id = links[i];
		var link = document.getElementById(id + "A");
		link.identifier = id;
		link.onclick = function() {
			hideDivs();
			document.getElementById(this.identifier + "Div").className = "visible";
			document.getElementById(this.identifier + "A").className = "active";
		}
	}

	function hideDivs() {
		for (var i = 0; i < length; i++) {
			var id = links[i];
			document.getElementById(id + "Div").className = "invisible";
			document.getElementById(id + "A").className = "inactive";
		}
	}
}

function generateCharts(options) {
	var options = {
		sortSeries: true,
		mean: {
			show: true,
			stroke: 1,
			position: "BOTTOM",
			side: "RIGHT"
		},
		median: {
			show: true,
			stroke: 1,
			position: "BOTTOM",
			side: "LEFT"
		},
		xAxis: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "14px"
		},
		yAxis: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "12px"
		},
		legend: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "14px"
		},
		nameUnderItem: {
			show: true
		}
	};

	var optionScatterPlot = {
		xAxis: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "14px"
		},
		yAxis: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "12px"
		},
		legend: {
			"font-family": "'Kite One', sans-serif",
			"font-size": "14px"
		},
		sizeByValue: true,
		serieColours: ["rgba(1, 169, 219, 0.7)", "rgba(220, 0, 154, 0.7)"],
		series: [{
            name: "First",
            values: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                    [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                    [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                    [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                    [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                    [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                    [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                    [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                    [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                    [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                    [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                    [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                    [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                    [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                    [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                    [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                    [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                    [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                    [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                    [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                    [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                    [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                    [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                    [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                    [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                    [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                    [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                    [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                    [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                    [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                    [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                    [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                    [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                    [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                    [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                    [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                    [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                    [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                    [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                    [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                    [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                    [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                    [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                    [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                    [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                    [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                    [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                    [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                    [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                    [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                    [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                    [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]
        }],
	};

	renderScatterPlot(optionScatterPlot);

	options.series = [
		{
			name: "First",
			values: [99.80]
		}
	];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "First",
            values: [70]
        },
        {
        	name: "Second",
         	values: [99]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [100, 200, 300]
        },
        {
        	name: "2013",
         	values: [-100, 0, 50]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [-5.5, 2, 3.7, 5, 6]
        },
        {
        	name: "2013",
         	values: [-50, 2.4, 5, 7, 8]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [5.5, 2, 3.7]
        },
        {
        	name: "2013",
         	values: [50, 7.4, 15]
        },
        {
        	name: "2009",
         	values: [10, 2.4, 5]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [1, 1, 1]
        }
    ];

    options.vertex = {
    	show: false
    };

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [5.5, 2, null, null, 3.7]
        },
        {
        	name: "2013",
         	values: [null, 50, 20.4, 15, null]
        },
        {
        	name: "2009",
         	values: [10, 2.4, 5, 3, 5]
        }
    ];

    options.vertex = {
    	show: true
    };

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [null]
        },
        {
        	name: "2013",
         	values: [null]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: []
        },
        {
        	name: "2013",
         	values: []
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.series = [
		{
            name: "2012",
            values: [null, 1, null]
        },
        {
        	name: "2013",
         	values: [null, null, null]
        }
    ];

	renderBarChart(options);
	renderStackedChart(options);
	renderLineChart(options);
	renderAreaChart(options);
	renderPieChart(options);
	renderDonutChart(options);
	renderPolarChart(options);

	options.xAxis.colour = "#ccc";

	options.series = [
		{
				name: "ESP",
				values: [1],
				continent: "Europe"
		},
		{
				name: "FRA",
				values: [2],
				continent: "Europe"
		},
		{
				name: "POR",
				values: [1.2],
				continent: "Europe"
		},
		{
				name: "GRE",
				values: [0.5],
				continent: "Europe"
		},
		{
				name: "ITA",
				values: [1],
				continent: "Europe"
		},
		{
				name: "IRL",
				values: [1.1],
				continent: "Europe"
		},
		{
				name: "SUI",
				values: [5],
				continent: "Europe"
		},
		{
				name: "NOR",
				values: [6],
				continent: "Europe"
		},
		{
				name: "GBR",
				values: [3],
				continent: "Europe"
		},
		{
				name: "GER",
				values: [5],
				continent: "Europe"
		},
		{
				name: "RUS",
				values: [1.3],
				continent: "Europe"
		},
		{
				name: "FIN",
				values: [6],
				continent: "Europe"
		},
		{
				name: "ISL",
				values: [0.3],
				continent: "Europe"
		},
		{
				name: "CAN",
				values: [5],
				continent: "America"
		},
		{
				name: "USA",
				values: [4.9],
				continent: "America"
		},
		{
				name: "MEX",
				values: [0.5],
				continent: "America"
		},
		{
				name: "CUB",
				values: [0.1],
				continent: "America"
		},
		{
				name: "AGO",
				values: [0],
				continent: "Africa"
		},
		{
				name: "ETH",
				values: [0],
				continent: "Africa"
		},
		{
				name: "EGY",
				values: [0],
				continent: "Africa"
		},
		{
				name: "SUD",
				values: [0],
				continent: "Africa"
		},
		{
				name: "CON",
				values: [0],
				continent: "Africa"
		},
		{
				name: "CCM",
				values: [0],
				continent: "Africa"
		},
		{
				name: "XX1",
				values: [0],
				continent: "Africa"
		},
		{
				name: "XX2",
				values: [0],
				continent: "Africa"
		},
		{
				name: "XX3",
				values: [0],
				continent: "Africa"
		},
		{
				name: "CHI",
				values: [3],
				continent: "Asia"
		},
		{
				name: "KOR",
				values: [0],
				continent: "Asia"
		},
		{
				name: "JAP",
				values: [5],
				continent: "Asia"
		}
	];

	options.getElementColour = function(options, element, index) {
		var pos = 0;

		switch(element.continent) {
			case "Europe":
				pos = 0;
				break;
			case "America":
				pos = 1;
				break;
			case "Africa":
				pos = 2;
				break;
			case "Asia":
				pos = 3;
				break;
		}

		return options.serieColours[pos];
	};

	options.getLegendElements = function(options) {
		var elements = [];

		var series = options.series;
		var length = series.length;

		for (var i = 0; i < length; i++) {
			var continent = series[i].continent;

			if (elements.indexOf(continent) == -1)
				elements.push(continent);
		}

		elements = elements.sort();

		var length = elements.length;

		for (var i = 0; i < length; i++)
			elements[i] = {
				name: elements[i],
				continent: elements[i]
			};

		return elements;
	};

	options.maxRankingRows = 6;
	options.margins = [2, 10, 1, 1];
	options.xAxis.title = options.yAxis.title = "";

	renderRankingChart(options);
}

function renderBarChart(options) {
	var chart = wesCountry.charts.barChart(options);
	document.getElementById("barDiv").appendChild(chart.render());
}

function renderStackedChart(options) { 
	var chart = wesCountry.charts.stackedChart(options);
	document.getElementById("stackedDiv").appendChild(chart.render());
}

function renderLineChart(options) {
	var chart = wesCountry.charts.lineChart(options);
	document.getElementById("lineDiv").appendChild(chart.render());
}

function renderPieChart(options) {
	var chart = wesCountry.charts.pieChart(options);
	document.getElementById("pieDiv").appendChild(chart.render());
}

function renderDonutChart(options) {
	var chart = wesCountry.charts.donutChart(options);
	document.getElementById("donutDiv").appendChild(chart.render());
}

function renderPolarChart(options) {
	var chart = wesCountry.charts.polarChart(options);
	document.getElementById("polarDiv").appendChild(chart.render());
}

function renderScatterPlot(options) { 
	var chart = wesCountry.charts.scatterPlot(options);
	document.getElementById("scatterDiv").appendChild(chart.render());
}

function renderAreaChart(options) {
	var chart = wesCountry.charts.areaChart(options);
	document.getElementById("areaDiv").appendChild(chart.render());
}

function renderRankingChart(options) {
	var chart = wesCountry.charts.rankingChart(options);
	document.getElementById("rankingDiv").appendChild(chart.render());
}

window.onload = function () {
	var myOptions = {
		container: "body",
		chartType: ["line", "bar", "pie", "area"],
		xAxis: {
				title: "Years",
				values: ["2007", "2008", "2009"]
		}
	};

	data.parseTable(myOptions);
}
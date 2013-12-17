window.onload = function () {
	var myOptions = {
		container: "body",
		chartType: ["line", "bar", "pie", "area"],
		xAxis: {
				title: "Years",
				values: ["2007", "2008", "2009"]
		}
	};

	wesCountry.data.parseTable(myOptions);
}
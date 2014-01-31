window.onload = function( ) {
	var myOptions = {
		tablePosition: "above",
		chartType: ["line", "bar", "pie", "area"],
		xAxis: {
				title: "Years"
		}
	};

	wesCountry.data.parseTable(myOptions, "byIndicator");
	myOptions.tablePosition = "below";
	wesCountry.data.parseTable(myOptions, "byIndicatorAndTime");

}
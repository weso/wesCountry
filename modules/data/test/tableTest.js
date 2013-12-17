window.onload = function () {
	var myOptions = {
		container: "body",
		chartType: ["line", "bar", "pie", "area"],
		xAxis: {
				title: "Years"
		}
	};

	wesCountry.data.parseTable(myOptions);
}
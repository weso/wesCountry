/*var loader = wesCountry.loader.render({
	url: "test.php",
	callback: function() {
		console.log('ready');

		loader.load({
			url: "test.php"
		});
	}
});
*/
var loader2 = wesCountry.loader.renderChart({
	url: "test.php",
	chartType: "map",
	container: "#graph",
	title: "Render chart"
});

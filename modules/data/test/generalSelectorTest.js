window.onload = function () {
	var info = [
	{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"243.951870842302", "dataset":""},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"309.008997833499", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"326.585848270781", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"256.268026665139", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"222.458534003048", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"430.564095118456", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"106.145003684811", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"89.1699567127999", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Fertilizer consumption (% of fertilizer production)", "value":"117.185367443222", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Arable land (% of land area)", "value":"8.3244477753794", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Arable land (% of land area)", "value":"8.30305150944155", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Arable land (% of land area)", "value":"8.01846935132669", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Arable land (% of land area)", "value":"23.5500101992249", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Arable land (% of land area)", "value":"25.402869381927", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Arable land (% of land area)", "value":"24.3795471544163", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Arable land (% of land area)", "value":"25.0541299117883", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Arable land (% of land area)", "value":"25.0360866078589", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Arable land (% of land area)", "value":"25.2168860571818", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"5.62672623388818", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"5.9141622585208", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"5.56271655090331", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"1.89142918105124", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"2.01178849487375", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"2.04609396554568", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"2.66654201229147", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"2.65729482291889", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Agriculture, value added (% of GDP)", "value":"2.87540037421114", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Rural population", "value":"30891212.679144", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Rural population", "value":"31191436.534818", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Rural population", "value":"31474139.056256", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Rural population", "value":"19205322.994672", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Rural population", "value":"19165922.234712", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Rural population", "value":"19094617.940088", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Rural population", "value":"10482125.633644", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Rural population", "value":"10454672.376272", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Rural population", "value":"10351687.69581", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2009", "indicatorCode":"Rural population growth (annual %)", "value":"-0.967182295925118", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2008", "indicatorCode":"Rural population growth (annual %)", "value":"-0.902263919618411", "dataset":"World Bank"},
	{"countryCode":"BR", "countryName":"Brazil", "year":"2007", "indicatorCode":"Rural population growth (annual %)", "value":"-0.810763984537661", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2009", "indicatorCode":"Rural population growth (annual %)", "value":"0.205366146301866", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2008", "indicatorCode":"Rural population growth (annual %)", "value":"0.372730635007465", "dataset":"World Bank"},
	{"countryCode":"IT", "countryName":"Italy", "year":"2007", "indicatorCode":"Rural population growth (annual %)", "value":"0.340997807364338", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2009", "indicatorCode":"Rural population growth (annual %)", "value":"0.262249013369087", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2008", "indicatorCode":"Rural population growth (annual %)", "value":"0.989942701499551", "dataset":"World Bank"},
	{"countryCode":"ES", "countryName":"Spain", "year":"2007", "indicatorCode":"Rural population growth (annual %)", "value":"1.20938599518874", "dataset":"World Bank"}
	];


	var myOptions = {
		data: info,
		container: "body",
		chartType: ["line", "bar", "pie", "area"],
		xAxis: {
				title: "Years"
		}
	};

	
	var graphicFunctionNames = ["byIndicator", "byRegion", "byTime", "byIndicatorAndTime", "byIndicatorAndRegion", "byTimeAndRegion"];
	wesCountry.data.parseJSON(myOptions).iterate().selectBy("indicator", graphicFunctionNames);
}
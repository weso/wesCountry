if (typeof(wesCountry) === "undefined")
	var wesCountry = new Object();

wesCountry.data = new (function() {
	var myData = null;
	var options = {};
	var allSeries = [];

	this.parseJSON = function (receivedOptions) {
		var filterByIndicator = function (element) {
			return element.indicatorCode === indicatorCode;
		}
		options = receivedOptions;
		var json = options.data;
		var hashTableIndicator = new HashTable();
		for(var i=0;i<json.length;i++) {
			var indicatorCode = json[i].indicatorCode;
			if(!hashTableIndicator.hasItem(indicatorCode)) {
				var filtered = json.filter(filterByIndicator);
				var filtered = filtered.sort(sortByYear);
				var hashTable = new HashTable();
				for(var j=0;j<filtered.length;j++) {
					if(hashTable.hasItem(filtered[j].countryName)) {
						var values = hashTable.getItem(filtered[j].countryName);
						values.push(parseFloat(filtered[j].value));
						hashTable.setItem(filtered[j].countryName, values);
					} else {
						var values = [parseFloat(filtered[j].value)];
						hashTable.setItem(filtered[j].countryName, values);
					}
				}
				hashTableIndicator.setItem(json[i].indicatorCode, hashTable);
			}
		}
		myData = hashTableIndicator;
		return this;
	}

	this.parseTable = function (receivedOptions) {
		var tables = document.querySelectorAll(".graphs");
		for(var i=0;i<tables.length;i++) {
			var headers = tables[i].querySelectorAll("th");
			var rows = tables[i].querySelectorAll("tr");
			var json = [];
			for(var j=1;j<rows.length;j++) {
				var obj = new Object();
				var data = rows[j].querySelectorAll("td");
				for(var k=0;k<data.length;k++) {
					obj[headers[k].className] = data[k].innerHTML;
				}
				json.push(obj);
			}
			receivedOptions.data = json;
			this.parseJSON(receivedOptions).iterate();
		}
	}

	this.iterate = function () {
		if(myData !== null) {
			var div = document.createElement("div");
			div.className = "indicatorSelector";
			document.querySelector(options.container).appendChild(div);
			var select = document.createElement("select");
			div.appendChild(select);
			select.onchange = onIndicatorChanged;
			var indicators = myData.keys();
			indicators = indicators.array;
			for(var i in indicators) {
				var countries = myData.getItem(indicators[i]).keys().array;
				var seriesByIndicator = [];
				for(var c in countries) {
					seriesByIndicator.push({
						name: countries[c],
						values: myData.getItem(indicators[i]).getItem(countries[c])
					});
				}
				allSeries.push(seriesByIndicator);
				var option = document.createElement("option");
				option.innerHTML = indicators[i];
				select.appendChild(option);
			}
			drawSelectedIndicator();
		}
		function onIndicatorChanged () {
			document.querySelector(".chartDiv").remove();
			document.querySelector(".seriesSelector").remove();
			document.querySelector(".chartSelector").remove();
			drawSelectedIndicator();
		}

		function drawSelectedIndicator() {
			var index = select.selectedIndex;
			options.series = allSeries[index];
			wesCountry.charts.multiChart(JSON.parse(JSON.stringify(options)));
		}
	}

	var sortByYear = function (a,b) {
		return a.year - b.year;
	}

})();
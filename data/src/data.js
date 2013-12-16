if (typeof(exports) === "undefined")
	exports = new Object();

var data = exports.data = new (function() {
	var myData = null;
	var options = {};
	var allSeries = [];

	this.create = function (receivedOptions) {
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

	this.iterate = function () {
		if(data !== null) {
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
			jGraf.multiChart(JSON.parse(JSON.stringify(options)));
		}
	}

	var sortByYear = function (a,b) {
		return a.year - b.year;
	}

})();
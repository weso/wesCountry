if (typeof(exports) === "undefined")
	exports = new Object();

var data = exports.data = new (function() {
	////////////////////////////////////////////////////////////////////////////////
	//                                 JSON PARSE
	////////////////////////////////////////////////////////////////////////////////

	this.jsonParse = function (json) {
		var hashTable = new HashTable();
		for(var i=0;i<json.length;i++) {
			if(hashTable.hasItem(json[i].countryName)) {
				var values = hashTable.getItem(json[i].countryName);
				values.push(parseFloat(json[i].value));
				hashTable.setItem(json[i].countryName, values);
			} else {
				var values = [parseFloat(json[i].value)];
				hashTable.setItem(json[i].countryName, values);
			}
		}
		var options = {
			series: []
		};
		var keys = hashTable.keys().array;
		for(var i=0;i<keys.length;i++) {
			options.series.push({
				name: keys[i],
				values: hashTable.getItem(keys[i])
			});
		}
		return options;
	}

})();
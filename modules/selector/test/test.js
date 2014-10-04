var dataYears = [
	{
		label: "2007",
		code: "2007",
		children: []
	},
	{
		label: "2008",
		code: "2008",
		children: []
	},
	{
		label: "2009",
		code: "2009",
		children: []
	},
	{
		label: "2010",
		code: "2010",
		chidren: []
	}
];

var dataCountries = [
	{
		label: "AFRICA",
		children: []
	},
	{
		label: "EAST ASIA & PACIFIC",
		children: [
			{
				label: "JAPAN",
				code: "JPN",
				children: []
			},
			{
				label: "CHINA",
				code: "CHI",
				children: []
			}
		]
	},
	{
		label: "EUROPE & CENTRAL ASIA",
		children: [
			{
				label: "SPAIN",
				code: "ESP",
				children: []
			},
			{
				label: "FRANCE",
				code: "FRA",
				children: []
			},
			{
				label: "PORTUGAL",
				code: "POR",
				children: []
			},
			{
				label: "UNITED KINGDOM",
				code: "GBR",
				children: []
			}
		]
	},
	{
		label: "OTHER",
		children: [
			{
				label: "OTHER 1",
				code: "OT1"
			},
			{
				label: "OTHER 2",
				code: "OT2"
			}
		]
	}
];

function timeCallback(element, selectedItems) {
	var result = "YEAR(" + selectedItems.getArray() + ")";
	document.getElementById("first_result").innerHTML = result;
}

function countryCallback(element, selectedItems) {
	var result = "COUNTRY(" + selectedItems.getArray() + ")";
	document.getElementById("second_result").innerHTML = result;
}

var yearSelector = new wesCountry.selector.basic(dataYears, { callback: timeCallback, maxSelectedItems: 3 });
document.getElementById("first").appendChild(yearSelector.render());

var countrySelector = new wesCountry.selector.basic(dataCountries, { callback: countryCallback, selectedItems: ["ESP"], maxSelectedItems: 3 });
document.getElementById("second").appendChild(countrySelector.render());

console.log(countrySelector.selected())

wesCountry.selector.timeline({
	container: '#third',
	maxShownElements: 5,
	elements: [
		2003,
		2004,
		2005,
		2006,
		2007,
		2008,
		2009,
		2010,
		2011,
		2012
	]
});

wesCountry.selector.timeline({
	container: '#third',
	maxShownElements: 3,
	elements: [
		2008,
		2009,
		2010,
		2011,
		2012
	]
});

var timeline = wesCountry.selector.timeline({
	container: '#third',
	maxShownElements: 5,
	elements: [
		2008,
		2009,
		2010,
		2011,
		2012,
		2013
	],
	onChange: function() {
		console.log(timeline.selected())
	}
});

function clearYearSelector() {
	yearSelector.clear();
}

function clearCountrySelector() {
	countrySelector.clear();
}

function selectAllYearSelector() {
	yearSelector.selectAll();
}

function selectAllCountrySelector() {
	countrySelector.selectAll();
}

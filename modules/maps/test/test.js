var map = wesCountry.maps.createMap({
	container: '#map',
	countries: [
		{
			"code": "ESP",
			"value": 1
		},
		{
			"code": "FRA",
			"value": 2
		},
		{
			"code": "GBR",
			"value": 3
		},
		{
			"code": "ITA",
			"value": 4
		},
		{
			"code": "IRL",
			"value": 5
		},
		{
			"code": "USA",
			"value": 6
		},
		{
			"code": "PRT",
			"value": 7
		},
		{
			"code": "FIN",
			"value": 8
		},
		{
			"code": "DEU",
			"value": 9
		},
		{
			"code": "CHE",
			"value": 10
		},
		{
			"code": "RUS",
			"value": 7.5
		},
		{
			"code": "SWE",
			"value": 8
		},
		{
			"code": "NOR",
			"value": 8
		},
		{
			"code": "CAN",
			"value": 8
		},
		{
			"code": "UKR",
			"value": 2
		},
		{
			"code": "KAZ",
			"value": 0
		},
		{
			"code": "BLR",
			"value": 1
		},
		{
			"code": "MNG",
			"value": 2
		},
		{
			"code": "CHN",
			"value": 1.5
		},
		{
			"code": "ISL",
			"value": 1
		}
	]
});

map.zoomToCountry('FRA');
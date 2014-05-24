if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.ajax = new (function() {
	var defaultOptions = {
		method: 'GET',
		parameters: '',
		callback: function(data) { console.log(data); },
		content_type: false,
		cache_enabled: false
	};

	// Cache

	var cache = {};
	
	this.load = function(options)
	{
		options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);	
		
		var http = false;

		if (window.XMLHttpRequest)
			http = new XMLHttpRequest();
		else if (window.ActiveXObject)
			http = new ActiveXObject('Microsoft.XMLHTTP');

		var url = options.url;

		if (!url)
			return;

		var method = options.method;
		var parameters = options.parameters;
		var callback = options.callback;
		var content_type = options.content_type;
		var cache_enabled = options.cache_enabled
		
		if (method == 'GET')
			url += '?' + parameters;

		if (cache_enabled === true && cache[url]) {
			callback.call(null, cache[url]);
		}
		else if(http)
		{
			http.open(method, url, true);

			if (method != 'GET' && content_type != false)
			{
				// Header is sent with the request
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}

			http.send(method == 'GET' ? null : parameters);

			http.onreadystatechange = function()
			{
				if(http.readyState == 4 && callback != null && callback != undefined) {
					cache[url] = http.responseText;

					callback.call(null, http.responseText);
				}
			};
		}
	}
})();
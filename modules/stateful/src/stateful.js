if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.stateful = new (function() {
	var defaultOptions = {
	init: function(parameters) {
		console.log('wesCountry:stateful init');
	},
	urlChanged: function(parameters) {
		console.log('wesCountry:stateful urlChanged');
	},
    elements: [
/*      {
        name: "name",
        selector: "#selector",
        value: "value",
        ignoreValue: true,
        ignore: true,
        selectedIndex: 0,
        selectedIndex: function() { return 0; },
        onChange: function(index, value, parameters) {},
        removeIfEmpty
      } */
    ]
	};

  var parameters = {};
  var queryParameters = [];
  var queryParametersDict = {};
  var selectors = {};
  var host = "";
  var hash = "";
  var options = null;

  this.getParameters = function() {
  	return parameters;
  }

  /* IE9 compatibility */
  this.getFullURL = function() {
    return getFullURL();
  }

  this.getSelectors = function() {
  	return selectors;
  }

  // onChange is not invoked
  this.changeParameter = function(name, value) {
  	changeParameter(name, value);
  }

  this.start = function(opts) {
    // Merge default options and user options
    options = wesCountry.mergeOptionsAndDefaultOptions(opts, defaultOptions);

    var info = getUrlParameters();
    parameters = info.parameters;
    host = info.host;
    hash = info.hash;

    var urlDifferentFromInitial = processElements(options, parameters);

    if (urlDifferentFromInitial)
      changeUrl();

    if (options.init)
    	options.init.call(this, parameters, selectors);

    return this;
  }

  function changeUrl() {
    if (history && history.pushState)
      history.pushState({}, document.title, getFullURL());

    if (options.urlChanged)
    	options.urlChanged.call(this, parameters, selectors);
  }

  function getFullURL() {
    var queryString = getQueryString();
	
	var hash = hash && hash != "" ? "#" + hash : "";
	
    return String.format("{0}?{1}{2}", host, queryString, hash);
  }

  function getQueryString() {
    var queryString = "";

    var length = queryParameters.length;

    for (var i = 0; i < length; i++) {
      var name = queryParameters[i];
      var value = parameters[name]
      var element = queryParametersDict[name];
      
      if (element.removeIfEmpty && value === "")
      	continue;

      queryString += String.format("{0}{1}={2}", queryString == "" ? "" : "&", name, value);
    }

    return queryString;
  }

  function processElements(options, parameters) {
    var elements = options.elements;

    var changed = false;

	  var initialActions = [];

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      var ignore = (element.ignore === true);
      var ignoreValue = (element.ignoreValue === true);

      if (!ignore && !parameters[element.name]) {
        parameters[element.name] = "";

        changed = true;
      }

      if (!ignore && !ignoreValue && parameters[element.name] == "") {
        var value = element.value ? element.value : "";

        if (parameters[element.name] != value)
          changed = true;

        parameters[element.name] = value;
      }

      if (!ignore && queryParameters.indexOf(element.name) == -1) {
        queryParameters.push(element.name);
        queryParametersDict[element.name] = element;
    }

      if (element.selector) {
        var selector = typeof element.selector === 'string' ? document.querySelector(element.selector) : element.selector;
        var action = processSelector(selector, element.name, parameters[element.name], element.onChange, element.selectedIndex);

      	if (action)
      		initialActions.push(action);

        selectors[element.selector] = selector;
      }
    }

    // We need to process all the selectors firstly
    // and then we can process initial actions as maybe one selector initial action could invoke other one
    for (var i = 0; i < initialActions.length; i++) {
    	var selector = initialActions[i].selector;
    	var selectedIndex = initialActions[i].selectedIndex;

		var isFunction = selectedIndex && wesCountry.isFunction(selectedIndex);

      if (isFunction)
        selectedIndex = selectedIndex.call(this, parameters, selectors);

      if (selectedIndex >= 0 && selectedIndex < selector.options.length) {
    	  selector.selectedIndex = selectedIndex;
    	  selector.refresh(true);
      }
      else if (!isFunction)
		selector.refresh(true);
    	}

    return changed;
  }

  function changeParameter(name, value) {
    var changed = false;

    if (!parameters[name]) {
      parameters[name] = "";

      changed = true;
    }
    
    var element = queryParametersDict[name];

    if (parameters[name] != value && (value != "" || (element.removeIfEmpty && value === ""))) {
      parameters[name] = value;

      changed = true;
    }

    if (changed)
      changeUrl();
  }

  function processSelector(selector, elementName, initialValue, onChange, selectedIndex) {
    selector.element = elementName;
    //selector.element = selector.name ? selector.name : selector.id;

    wesCountry.registerEvent(selector, 'change', function() {
      //var value = this.options[this.selectedIndex].value;

      var value = this.selected ? this.selected() : this.value;

      changeParameter(this.element, value);

      if (onChange)
        onChange.call(selector, this.selectedIndex, value, parameters, selectors, false);
    });

    // Refresh function
    selector.refresh = function(initial) {
    	var value = "";
    	
    	if (this.selected)
    		value = this.selected();
    	else
      		value = (this.options && this.options && this.options[this.selectedIndex]) ?
                    this.options[this.selectedIndex].value : "";

      changeParameter(this.element, value);

      if (onChange)
        onChange.call(this, this.selectedIndex, value, parameters, selectors, initial);
    }

    // Set initial value
    var options = selector.options;
	
	if (selector.select)
		selector.select(initialValue);
	else {
		for (var i = 0; i < options.length; i++)
		  if (options[i].value == initialValue) {
			selector.selectedIndex = i;

			break;
		  }
	}
    // Set selected index

    return {
    	selector: selector,
    	selectedIndex: selectedIndex
    };
  }

  function getUrlParameters() {
    var parameters = {};

    var url = document.URL;
	
	var hash = url.split('#');
	
    var queryString = hash[0].split('?');
    
    hash = hash.length > 1 ? hash[1] : "";

    var host = queryString[0];

    if (queryString.length > 1) {
      queryString = queryString[1];

      queryString = queryString.split('&');

      for (var i = 0; i < queryString.length; i++) {
        var parameter = queryString[i].split("=");

        var name = parameter[0];
        var value = parameter[1] ? parameter[1] : "";

        parameters[name] = value;
      }
    }

    return {
      host: host,
      parameters: parameters,
      hash: hash
    };
  }
})();

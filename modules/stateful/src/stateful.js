if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.stateful = new (function() {
	var defaultOptions = {
    elements: [
/*      {
        name: "name",
        selector: "#selector",
        onChange: function() {}
      } */
    ]
	};

  var parameters = [];
  var host = "";

  this.start = function(options) {
    // Merge default options and user options
    options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

    var info = getUrlParameters();
    parameters = info.parameters;
    host = info.host;

    var urlDifferentFromInitial = processElements(options, parameters);

    if (urlDifferentFromInitial)
      changeUrl();
  }

  function changeUrl() {
    var queryString = getQueryString();

    history.pushState({}, document.title, String.format("{0}?{1}", host, queryString));
  }

  function getQueryString() {
    var queryString = "";

    for (var name in parameters)
      queryString += String.format("{0}{1}={2}", queryString == "" ? "" : "&", name, parameters[name]);

    return queryString;
  }

  function processElements(options, parameters) {
    var elements = options.elements;

    var changed = false;

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (!parameters[element.name]) {
        parameters[element.name] = "";

        changed = true;
      }

      if (parameters[element.name] == "") {
        var value = element.value ? element.value : "";

        if (parameters[element.name] != value)
          changed = true;

        parameters[element.name] = value;
      }

      if (element.selector)
        processSelector(element.selector, element.name, parameters[element.name], element.onChange);
    }

    return changed;
  }

  function changeParameter(name, value) {
    var changed = false;

    if (!parameters[name]) {
      parameters[name] = "";

      changed = true;
    }

    if (value != "" && parameters[name] != value) {
      parameters[name] = value;

      changed = true;
    }

    if (changed)
      changeUrl();
  }

  function processSelector(selector, elementName, initialValue, onChange) {
    selector = document.querySelector(selector);

    selector.element = elementName;
    //selector.element = selector.name ? selector.name : selector.id;

    wesCountry.registerEvent(selector, 'change', function() {
      var value = this.options[this.selectedIndex].value;
      changeParameter(this.element, value);

      if (onChange)
        onChange.call(this);
    });

    // Set initial value
    var options = selector.options;

    for (var i = 0; i < options.length; i++)
      if (options[i].value == initialValue) {
        selector.selectedIndex = i;

        break;
      }
  }

  function getUrlParameters() {
    var parameters = {};

    var url = document.URL;

    var queryString = url.split('?');

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
      parameters: parameters
    };
  }
})();

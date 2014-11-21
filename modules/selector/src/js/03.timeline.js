if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

if (!wesCountry.selector)
	wesCountry.selector = new Object();

////////////////////////////////////////////////////////////////////////////////
//                                    TIMELINE
////////////////////////////////////////////////////////////////////////////////

wesCountry.selector.timeline = function(options) {
	var defaultOptions = {
		"container": "body",
    "maxShownElements": 10,
		"elements": [
			2010,
			2011,
			2012
		],
		"selected": 2012,
		"onChange": function(element, index) {
			console.log(String.format("{0} {1}", index, element));
		}
	};

	var selectedElement = options.selected ? options.selected : null;
	var elementsStatus = {};

	return new (function() {
		var self = this;
		options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);
		selectedElement = options.elements.length > 0 ? options.elements[options.elements.length - 1] : null;
		
		var container = document.querySelector(options.container);

		var timeline = document.createElement('div');
		timeline.className = 'timeline';
		container.appendChild(timeline);

		var line = document.createElement('div');
		line.className = 'line';
		timeline.appendChild(line);

		var years = document.createElement('div');
		years.className = 'elements';
		timeline.appendChild(years);

		//var elementWidth = 100 / (options.elements.length > 0 ? options.elements.length : 1);
    var numberOfElements = options.elements.length > options.maxShownElements ?
                              options.maxShownElements + 2 : options.elements.length;
    var elementWidth = 100 / (numberOfElements > 0 ? numberOfElements : 1);

		elementWidth += '%';

		var elements = [];
    var texts = [];
    var anchors = {};
    var textAnchors = {};

    // Left arrow
    if (options.elements.length > options.maxShownElements) {
      var element = document.createElement('div');
      element.className = 'element';
      
      //element.title = options.elements[i];
      element.style.width = elementWidth;
      line.appendChild(element);

      element.onclick = function() {
        if (start > 0) {
          start--;

          var end = start + options.maxShownElements;

          for (var i = 0; i < elements.length; i++) {
            if (i >= start && i < end)
              elements[i].style.display = texts[i].style.display = 'block';
            else
              elements[i].style.display = texts[i].style.display = 'none';
          }

          if (start == 0)
            leftArrow.className = 'arrow arrow-left arrow-disabled';

          rightArrow.className = 'arrow arrow-right arrow-active';
        }
      }

      var leftArrow = document.createElement('a');
      leftArrow.className = "arrow arrow-left arrow-active";
      leftArrow.innerHTML = '<';
      element.appendChild(leftArrow);
      element.arrow = leftArrow;

      var space = document.createElement('div');
      space.style.width = elementWidth;
      space.style.height = '0.1em';
      space.className = 'element'
      years.appendChild(space);
    }
	
	// Elements status
	
	for (var i = 0; i < options.elements.length; i++) {
		var element = options.elements[i];
		elementsStatus[element] = true;
	}
	
    // Elements

    var start = options.elements.length <= options.maxShownElements ? 0 :
                  options.elements.length - options.maxShownElements;

		for (var i = 0; i < options.elements.length; i++) {
			// Circle
			var element = document.createElement('div');
			element.className = options.elements[i] == selectedElement ? 'element selected' : 'element';
			element.title = options.elements[i];
			element.style.width = elementWidth;
			line.appendChild(element);

      if (i < start)
        element.style.display = 'none';

			elements.push(element);

			var a = document.createElement('a');
			a.className = 'circle';
			a.title = options.elements[i];
      		a.index = i;
			element.appendChild(a);
			
			anchors[options.elements[i]] = a;

			a.onclick = function() {
				if (!elementsStatus[this.title])
					return;
					
				for (var j = 0; j < elements.length; j++)
					elements[j].className = "element";

				this.parentNode.className = "element selected";

				selectedElement = this.title;

				if (options.onChange)
					options.onChange.call(self, selectedElement, this.index);

				return false;
			}

			// Text
			var element = document.createElement('div');
			element.className = 'element';
			element.style.width = elementWidth;
			years.appendChild(element);

      if (i < start)
        element.style.display = 'none';

      texts.push(element);
      textAnchors[options.elements[i]] = element;

			var a = document.createElement('a');
			a.title = options.elements[i];
			a.index = i;
			a.setAttribute("data-index", options.elements[i]);
			element.appendChild(a);

			a.onclick = function() {
				if (!elementsStatus[this.title])
					return;
					
				for (var j = 0; j < elements.length; j++)
					elements[j].className = "element";
				
				elements[this.index].className = "element selected";

				selectedElement = this.title;
				
				self.selectedIndex = this.index;

				if (options.onChange)
					options.onChange.call(self, selectedElement);

				return false;
			}

			a.appendChild(document.createTextNode(options.elements[i]));
		}

    // Right arrow

    if (options.elements.length > options.maxShownElements) {
      var element = document.createElement('div');
      element.className = 'element element-right';
      //element.title = options.elements[i];
      element.style.width = elementWidth;
      line.appendChild(element);

      element.onclick = function() {
        if (start + options.maxShownElements < elements.length) {
          start++;

          var end = start + options.maxShownElements;

          for (var i = 0; i < elements.length; i++) {
            if (i >= start && i < end)
              elements[i].style.display = texts[i].style.display = 'block';
            else
              elements[i].style.display = texts[i].style.display = 'none';
          }

          if (end == elements.length)
            rightArrow.className = 'arrow arrow-right arrow-disabled';

          leftArrow.className = 'arrow arrow-left arrow-active';
        }
      }

      var rightArrow = document.createElement('a');
      rightArrow.className = "arrow arrow-right arrow-disabled";
      rightArrow.innerHTML = '>';
      element.appendChild(rightArrow);
      element.arrow = rightArrow;

      var space = document.createElement('div');
      space.style.width = elementWidth;
      space.style.height = '0.1em';
      space.className = 'element'
      years.appendChild(space);
    }

    // First onChange call

    if (selectedElement && options.onChange)
      options.onChange.call(self, selectedElement);

		this.selected = function() {
			return selectedElement;
		}
		
		this.addEventListener = function(event, handler) {
			options.onChange = handler;
		}
		
		this.options = elements;
		
		this.select = function(element) {
			var a = anchors[element];
			
			if (a) {
				a.click();
			}
		}
		
		this.getElements = function() {
			return options.elements;
		}
		
		this.enable = function(element) {
			if (elementsStatus[element] !== undefined) {
				elementsStatus[element] = true;
				
				if (anchors[element])
					anchors[element].className = anchors[element].className.replace(" enabled", "").replace(" disabled", "") + " enabled";
					
				if (textAnchors[element])
					textAnchors[element].className = textAnchors[element].className.replace(" enabled", "").replace(" disabled", "") + " enabled";
			}
		}
		
		this.disable = function(element) {
			if (elementsStatus[element] !== undefined) {
				elementsStatus[element] = false;
				
				if (anchors[element])
					anchors[element].className = anchors[element].className.replace(" enabled", "").replace(" disabled", "") + " disabled";
					
				if (textAnchors[element])
					textAnchors[element].className = textAnchors[element].className.replace(" enabled", "").replace(" disabled", "") + " disabled";
					
				if (element == selectedElement) {
					selectedElement = null;
					
					// Select first selectable item (from the end)
					for (var i = options.elements.length - 1; i >= 0; i--) {
						var e = options.elements[i];
						
						if (elementsStatus[e])
							this.select(e);
					}
				}	
			}
		}
		
		this.enableAll = function() {
			for (var element in elementsStatus)
				this.enable(element);
		}
		
		this.disableAll = function() {
			for (var element in elementsStatus)
				this.disable(element);
		}
		
		this.clear = function() {
			for (var j = 0; j < elements.length; j++)
				elements[j].className = "element";

			selectedElement = -1;
		}
	})();
};

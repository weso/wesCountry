if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.selector = new Object();

wesCountry.selector.basic = function(data, options) {
	var defaultOptions = {
		"ul-class": "default-selector",
		callback: null,
		maxSelectedItems: -1,
		selectedItems: []
	};

	var firstLevelItems = [];
	var selectedItems = new SortedArray();
	var root = null;

	function init() {
		// Merge default options and user options
		options = mergeOptionsAndDefaultOptions(options, defaultOptions);
	
		var list = generateList(data, null, 1, null, null);
		root = list.ul;

		// Set options.selectedItems as selected
		var selectedItems = list.selectedItems;
		var length = selectedItems.length;

		for (var i = 0; i < length; i++)
			selectedItems[i].onclick();
	}
	
	init();
	
	this.render = function() {
		return root;
	}
	
	this.clear = function() {
		var length = root.children.length;
		for (var i = 0; i < length; i++)
			updateElementStatus(root.children[i], null, false);
	}
	
	// List generation
	function generateList(element, parent, level, previousLink, parentLink) {
		var ul = document.createElement("ul");
		ul.className = options["ul-class"];
	
		// Sort children
		element.sort(function(a, b) {
			if (a.label < b.label)
				return -1;
			if (a.label > b.label)
				return 1;
			return 0;
		});
		
		var length = element.length;
		
		var firstChildLink = null;
		
		var selected = false;
		var selectedItems = [];
		
		for (var i = 0; i < length; i++) {
			var child = element[i];
			var childrenLength = child.children && child.children.length ? child.children.length : 0;
			
			var li = document.createElement("li");
			ul.appendChild(li);
			
			// Set parent information
			li.code = child.code;
			li.liParent = parent;
			li.data = child;
			
			// Selection
			li.isSelected = false;
			
			var currentLink = document.createElement("a");
			currentLink.href = "javascript: void(0)"
			currentLink.value = child.label;

			// Check if element is selected
			if (options.selectedItems.indexOf(li.code) != -1) {
				selected = true;
				selectedItems.push(currentLink);
			}

			if (parentLink == null)
				firstLevelItems.push(currentLink);

			// Previous and next links
			currentLink.previousSiblingLink = previousLink;
			currentLink.nextSiblingLink = null;
			currentLink.parentLink = parentLink;
			
			if (previousLink)
				previousLink.nextSiblingLink = currentLink;
	
			if (i == 0)
				firstChildLink = currentLink;
			
			currentLink.className = "circleAndText"
			li.appendChild(currentLink);
			
			// Click event on currentLink div
			// We set the parent of currentLink div (the LI element)
			currentLink.liParent = li;
			
			currentLink.onclick = function(event) { 
				elementClick(this.liParent, options.callback); 
				
				if (event)
					event.stopPropagation();	
			};
						
			// Plus or minus sign to show / hide children
			var plusOrMinus = document.createElement("div");
			plusOrMinus.className = childrenLength > 0 ? "plusOrMinus" : "hidden-plusOrMinus";
			plusOrMinus.innerHTML = "+";
			currentLink.appendChild(plusOrMinus);
				
			if (childrenLength > 0) {
				plusOrMinus.onclick = function(event) { 
					plusMinusClick(this);
					event.stopPropagation();
				}
			}
			
			// Keyboard event for link
			currentLink.plusOrMinus = plusOrMinus;
			
			currentLink.onkeydown = function(event) {
				if (event.keyCode == 13) {
					elementClick(this.liParent, options.callback); 	
					
					event.stopPropagation();
					return false;
				}
				else if (event.keyCode == 38) { // Up arrow key
					if (this.previousSiblingLink)
						this.previousSiblingLink.focus();
				
					event.stopPropagation();
					return false;
				}
				else if (event.keyCode == 40) { // Down arrow key
					// If opened go to first child
					if (this.plusOrMinus.opened && this.firstChildLink)
						this.firstChildLink.focus();
					else if (this.nextSiblingLink)
						this.nextSiblingLink.focus();
					// After last child we move onto next sibling
					else if (this.parentLink.nextSiblingLink)
						this.parentLink.nextSiblingLink.focus();
				
					event.stopPropagation();
					return false;
				}
				else if (event.keyCode == 37 || event.keyCode == 39) { // Left and right keys
					event.stopPropagation();
				
					plusMinusClick(this.plusOrMinus);
				
					event.keyCode = 9; 
					return event.keyCode
				}
			};
			
			var circle = document.createElement("div");
			circle.className = "circle";
			currentLink.appendChild(circle);
			
			var title = document.createElement("div");
			title.className = "title";
			currentLink.appendChild(title)
			
			var text = document.createTextNode(child.label);
			title.appendChild(text);
			
			// Update previous link
			previousLink = currentLink;
			
			if (childrenLength > 0) {			
				// Counter circle
				var counter = document.createElement("span");
				counter.className = "empty-counter";
				circle.appendChild(counter);
			
				text = document.createTextNode("0");
				counter.appendChild(text);
				
				// Set li properties
				li.counter = {
					div: counter,
					value: 0	
				};
				
				// Children
				var childrenUl = generateList(child.children, li, level + 1, previousLink, currentLink);
				li.appendChild(childrenUl.ul);
				
				// Update first child link
				currentLink.firstChildLink = childrenUl.firstChildLink;
				
				// Set plusOrMinus properties
				plusOrMinus.childrenUl = childrenUl.ul;
				
				// Check if any child is selected
				if (childrenUl.selected == true) {
					selected = true;
					// Update + / - symbol
					plusOrMinus.innerHTML = "-";
				}
					
				selectedItems = selectedItems.concat(childrenUl.selectedItems);	
			}
			
			// Set child number
			li.childNumber = child.children ? child.children.length : 0;
		}
		
		// Non top-level elements are initially hidden
		// Unless some child is in options.selectedItems
		if (level > 1 && selected == false)
			ul.style.display = "none";
	
		return {
					ul: ul,
					firstChildLink: firstChildLink,
					selected: selected,
					selectedItems: selectedItems
				};
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                            PLUS / MINUS CLICK
	////////////////////////////////////////////////////////////////////////////////	
	
	function plusMinusClick (element) {
		if (element.innerHTML == "+") {
			element.innerHTML = "&#8212;";
			
			if (element.childrenUl)
				element.childrenUl.style.display = "block";
				
			element.opened = true;
		}
		else {
			element.innerHTML = "+";
			
			if (element.childrenUl)
				element.childrenUl.style.display = "none";
				
			element.opened = false;
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                              ELEMENT CLICK
	////////////////////////////////////////////////////////////////////////////////	
	
	this.selectAll = function() {
		var length = firstLevelItems.length;
		for (var i = 0; i < length; i++)
			elementClick(firstLevelItems[i].liParent, null);
	}
	
	function elementClick(element, callback) {		
		var selected = !element.isSelected;
		
		if (selected && options.maxSelectedItems > 0 && selectedItems.length >= options.maxSelectedItems)
			return;
		
		updateElementStatus(element, callback, selected);
	}
	
	function updateElementStatus(element, callback, selected) {
		setElementStatus(element, selected);
		
		// Add element in its parent's counter
		if (element.liParent) {
			var oldParentCounter = element.liParent.counter.value;
			var parentCounter = selected ? oldParentCounter + 1 : oldParentCounter - 1;
		
			updateElementCounter(element.liParent, parentCounter);
			
			// An element is selected when all its children are selected
			// If an element is unselected then its parent must be unselected
			if (!selected) {
				element.liParent.className = "not-selected";
				element.liParent.isSelected = false;
				
				updateSelectedItems(element.liParent.code, false);
			} 
			else {
				// If you select all an element's children then the element must be selected
				if (parentCounter == element.liParent.childNumber) {
					element.liParent.className = "selected";
					element.liParent.isSelected = true;
					
					updateSelectedItems(element.liParent.code, true);
				}
			}
		}
			
		// Update current node's counter when has children
		// If the element is selected, the counter equals its child number
		// Else it equals 0
		if (element.childNumber > 0)
			updateElementCounter(element, selected ? element.childNumber : 0);
			
		// Callback invocation
		if (callback)
			callback.call(element, element.data, selectedItems);
	}
	
	function setElementStatus(element, status) {
		if (element.tagName.toLowerCase() == "li") {
			element.isSelected = status;
			element.className = status ? "selected" : "not-selected";
			
			// SelectedItems update
			updateSelectedItems(element.code, status);
			
			// Update anchor title
			var value = element.firstChild.value;
			element.firstChild.title = value + (status ? " is selected" : "");
		}
		
		var length = element && element.children && element.children.length ? element.children.length : 0;
		
		for (var i = 0; i < length; i++)
			setElementStatus(element.children[i], status);
	}
	
	function updateElementCounter(element, value) {	
		var counter = element.counter;
		
		counter.value = value;
		counter.div.innerHTML = counter.value; 
		
		counter.div.className = counter.value > 0 ? "counter" : "empty-counter";
		
		// Update anchor title
		var value = element.firstChild.value;
		element.firstChild.title = value + ": " + counter.value + 
			(counter.value != 1 ? " selected countries" : " selected country");
	}

	////////////////////////////////////////////////////////////////////////////////
	//                           UPDATE SELECTED ITEMS
	////////////////////////////////////////////////////////////////////////////////
	
	function updateSelectedItems(code, action) {
		if (code) {
			if (action)
				selectedItems.uniqueInsert(code);	
			else
				selectedItems.remove(code);
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//                              MERGING OPTIONS
	////////////////////////////////////////////////////////////////////////////////
	
	function mergeOptionsAndDefaultOptions(options, defaultOptions) {
		if (options) {
			if (typeof options === "string")
				options = { container: options };
		
			var auxOptions = clone(defaultOptions);
			
			for (var option in options)
				auxOptions[option] = mergeOptions(auxOptions[option], options[option]);
			
			options = auxOptions;
		}
		else
			options = clone(defaultOptions);
			
		return options;
	};
	
	function mergeOptions(to, from) {
		if (from instanceof Array) {
			return from;
		}
		else if (typeof from === "object") {
			for (var option in from) {
				to[option] = mergeOptions(to[option], from[option]);
			}

			return to;
		}
		else
			return from;
	};
	
	function clone(obj) {
		// Not valid for copying objects that contain methods
	    return JSON.parse(JSON.stringify(obj));
	}
};

////////////////////////////////////////////////////////////////////////////////
//                                    TIMELINE
////////////////////////////////////////////////////////////////////////////////
	
wesCountry.selector.timeline = function(options) {
	var defaultOptions = {
		"container": "body",
		"elements": [
			2010,
			2011,
			2012
		],
		"selected": 2012,
		"onChange": function(element) {
			console.log(element);
		}
	};
	
	var selectedElement = options.selected ? options.selected : null;
	
	return new (function() {
		options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);
	
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
	
		var elementWidth = 100 / (options.elements.length > 0 ? options.elements.length : 1);
		elementWidth += '%';
	
		var elements = [];
	
		for (var i = 0; i < options.elements.length; i++) {
			// Circle
			var element = document.createElement('div');
			element.className = options.elements[i] == options.selected ? 'element selected' : 'element';
			element.title = options.elements[i];
			element.style.width = elementWidth;
			line.appendChild(element);
		
			elements.push(element);
		
			var a = document.createElement('a');
			a.className = 'circle';
			a.title = options.elements[i];
			element.appendChild(a);
		
			a.onclick = function() {
				for (var j = 0; j < elements.length; j++)
					elements[j].className = "element";
			
				this.parentNode.className = "element selected";
		
				selectedElement = this.title;
		
				if (options.onChange)
					options.onChange(selectedElement);
		
				return false;	
			}
		
			// Text
			var element = document.createElement('div');
			element.className = 'element';
			element.style.width = elementWidth;
			years.appendChild(element);
		
			var a = document.createElement('a');
			a.title = options.elements[i];
			a.index = i;
			element.appendChild(a);
			
			a.onclick = function() {
				for (var j = 0; j < elements.length; j++)
					elements[j].className = "element";
			
				elements[this.index].className = "element selected";
		
				selectedElement = this.title;
		
				if (options.onChange)
					options.onChange(selectedElement);
		
				return false;	
			}
		
			a.appendChild(document.createTextNode(options.elements[i]));
		}
		
		this.selected = function() {
			return selectedElement;
		}
	})();
};
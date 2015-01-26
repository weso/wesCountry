if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

if (!wesCountry.selector)
	wesCountry.selector = new Object();

wesCountry.selector.basic = function(options) {
	var defaultOptions = {
		"ul-class": "default-selector",
		data: [],
		onChange: function(element, index) {
			console.log(String.format("{0} {1}", index, element));
		},
		beforeChange: function(element, index) {
			console.log(String.format("{0} {1}", index, element));
		},
		maxSelectedItems: -1,
		selectedItems: [],
		labelName: "label",
		valueName: "code",
		childrenName: "children",
		sort: true,
		autoClose: false,
		selectParentNodes: true
	};

	var firstLevelItems = [];
	var selectedItems = new SortedArray();
	var root = null;
	var elements = {};
	var self = this;
	var collapsableElements = [];

	function init() {
		// Merge default options and user options
		options = wesCountry.mergeOptionsAndDefaultOptions(options, defaultOptions);

		var list = generateList(options.data, null, 1, null, null);
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
		selectedItems = new SortedArray();
		
		clearElements(root);
	}
	
	function clearElements(element) {
		var length = element && element.children && element.children.length ? element.children.length : 0;
		
		for (var i = 0; i < length; i++) {
			var child = element.children[i];
				
			updateElementStatus(child, null, false);
			clearElements(child.querySelector("ul"));	
		}
	}
	
	this.selected = function() {
		return selectedItems.getArray().toString();
	}
	
	this.selectedLength = function() {
		return selectedItems.length;
	}
	
	this.addEventListener = function(event, handler) {
		options.onChange = handler;
	}
	
	this.options = [];
	
	this.select = function(objects) {
		self.clear();
		
		changeElementsStatus(objects, true);
	}
	
	this.unselect = function(objects) {
		changeElementsStatus(objects, false);
	}
	
	function changeElementsStatus(objects, status) {
		objects = objects.split(",");
		var length = objects.length;

		for (var i = 0; i < length; i++) {
			var element = objects[i];

			if (element in elements)
				updateElementStatus(elements[element], null, status);
		}
	}

	// List generation
	function generateList(element, parent, level, previousLink, parentLink) {
		var ul = document.createElement("ul");
		ul.className = options["ul-class"];

		// Sort children
		
		var labelName = options.labelName;
		
		if (options.sort)
			element.sort(function(a, b) {
				if (a[labelName] < b[labelName])
					return -1;
				if (a[labelName] > b[labelName])
					return 1;
				return 0;
			});

		var length = element.length;

		var firstChildLink = null;

		var selected = false;
		var selectedItems = [];

		for (var i = 0; i < length; i++) {
			var child = element[i];
			var childrenLength = child[options.childrenName] && child[options.childrenName].length ? child[options.childrenName].length : 0;

			var li = document.createElement("li");
			ul.appendChild(li);

			// Set parent information
			li.code = child[options.valueName];
			li.liParent = parent;
			li.data = child;

			// Selection
			li.isSelected = false;

			var currentLink = document.createElement("a");
			currentLink.href = "javascript: void(0)"
			currentLink.value = child[options.labelName];
			
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

			// We set the parent of currentLink div (the LI element)
			currentLink.liParent = li;
			
			// Click event on currentLink div
			currentLink.onclick = function(event) {
				elementClick(this.liParent, options.onChange);

				if (event)
					event.stopPropagation();
			};
			
			// Save element in dictionary
			elements[li.code] = li;

			// Plus or minus sign to show / hide children
			var plusOrMinus = document.createElement("div");
			plusOrMinus.className = childrenLength > 0 ? "plus-element plusOrMinus" : "hidden-plusOrMinus";
			plusOrMinus.innerHTML = "+";
			plusOrMinus.parentUl = ul;
			currentLink.appendChild(plusOrMinus);

			if (childrenLength > 0) {
				plusOrMinus.onclick = function(event) {
					plusMinusClick(this);
					event.stopPropagation();
				}
			}
			
			collapsableElements.push(plusOrMinus);

			// Keyboard event for link
			currentLink.plusOrMinus = plusOrMinus;

			currentLink.onkeydown = function(event) {
				if (event.keyCode == 13) {
					elementClick(this.liParent, options.onChange);

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

			var text = document.createTextNode(child[options.labelName]);
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
				var childrenUl = generateList(child[options.childrenName], li, level + 1, previousLink, currentLink);
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
			li.childNumber = child[options.childrenName] ? child[options.childrenName].length : 0;
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
			if (options.autoClose) {
				// Close siblings
				
				var children = element.parentUl.querySelectorAll(".plus-element");

				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					closeElement(child);
				}
			}
			
			element.innerHTML = "&#8212;";

			if (element.childrenUl)
				element.childrenUl.style.display = "block";

			element.opened = true;
		}
		else {
			closeElement(element);
		}
	}
	
	function closeElement(element) {
		element.innerHTML = "+";

		if (element.childrenUl)
			element.childrenUl.style.display = "none";

		element.opened = false;
	}

	////////////////////////////////////////////////////////////////////////////////
	//                              ELEMENT CLICK
	////////////////////////////////////////////////////////////////////////////////

	this.selectAll = function() {
		var length = firstLevelItems.length;
		for (var i = 0; i < length; i++)
			elementClick(firstLevelItems[i].liParent, null);
	}

	function elementClick(element, onChange) {
		if (element.childNumber > 0 && !options.selectParentNodes)
			return;
		
		var selected = !element.isSelected;

		if (selected && options.maxSelectedItems > 0 && selectedItems.length >= options.maxSelectedItems)
			return;

		updateElementStatus(element, onChange, selected);
	}

	function updateElementStatus(element, onChange, selected) {
		var oldClass = element.className;
		setElementStatus(element, selected);

		// Add element in its parent's counter
		if (element.liParent) {
			if (element.liParent.counter != undefined && element.liParent.counter.value != undefined) {
				var oldParentCounter = element.liParent.counter.value;

				if (oldClass == "" || oldClass == "not-selected")
					var parentCounter = selected ? oldParentCounter + 1 : oldParentCounter;
				else
					var parentCounter = selected ? oldParentCounter : oldParentCounter - 1;
					
				if (parentCounter < 0)
					parentCounter = 0;

				updateElementCounter(element.liParent, parentCounter);
			}
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

		// onChange invocation
		if (onChange) {
			if (options.beforeChange)
				options.beforeChange.call(self, selectedItems, {
					code: element.code,
					selected: selected,
					element: element
				});
			
			onChange.call(self, selectedItems);
		}
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

		var length = element && element[options.childrenName] && element[options.childrenName].length ? element[options.childrenName].length : 0;

		for (var i = 0; i < length; i++)
			setElementStatus(element[options.childrenName][i], status);
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
};

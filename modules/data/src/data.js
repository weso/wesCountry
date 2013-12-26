Element.prototype.insertAfter = function(newNode) {
    this.parentNode.insertBefore(newNode, this.nextSibling);
};

if (typeof (wesCountry) === "undefined")
    var wesCountry = new Object();

wesCountry.data = new (function() {
    var myData = {};
    var options = {};
    var tablePosition = null;
    var tableElement;
    var xAxisValues = {};
    var series = {};

    this.parseJSON = function(receivedOptions) {
        options = wesCountry
                .charts.mergeOptionsAndDefaultOptions(receivedOptions, wesCountry.charts.defaultOptions);
        var json = options.data;
        xAxisValues.time =  new JsonParser(json).parseByTime();
        xAxisValues.indicator =  new JsonParser(json).parseByIndicator();
        xAxisValues.region =  new JsonParser(json).parseByRegion();
        xAxisValues.indicatorAndTime = new JsonParser(json).parseByIndicatorAndTime();
        xAxisValues.indicatorAndRegion = new JsonParser(json).parseByIndicatorAndRegion();
        xAxisValues.timeAndRegion = new JsonParser(json).parseByTimeAndRegion();
        return this;
    };

    this.parseTable = function(receivedOptions, functionName, argumentToGraphic) {
        var tables = document.querySelectorAll(".graphs");
        for (var i = 0; i < tables.length; i++) {
            tableElement = tables[i]; //current table
            var headers = tables[i].querySelectorAll("th");
            var rows = tables[i].querySelectorAll("tr");
            var json = [];
            for (var j = 1; j < rows.length; j++) {
                var obj = new Object();
                var data = rows[j].querySelectorAll("td");
                for (var k = 0; k < data.length; k++) {
                    obj[headers[k].className] = data[k].innerHTML;
                }
                json.push(obj);
            }
            receivedOptions.data = json;
            if (receivedOptions.container === undefined)
                tablePosition = receivedOptions.tablePosition;
            var iterator = this.parseJSON(receivedOptions).iterate()[functionName](argumentToGraphic);
        }

    };

    this.iterate = function() {
        return new Iterator(myData);
    };

    function JsonParser(json) {

        this.parseByIndicator = function() {
            var returned = myData.indicator = getHashTable(sortByYear, "indicatorCode", "countryName", "value", "year");
            myData.indicator = returned[0];
            return returned[1];
        };

        this.parseByTime = function() {
            var sortByIndicator = undefined;
            
            var returned = getHashTable(sortByIndicator, "year", "countryName", "value", "indicatorCode");
            myData.time = returned[0];
            return returned[1];
        };

        this.parseByRegion = function() {
            var returned = getHashTable(sortByYear, "countryName", "indicatorCode", "value", "year");
            myData.region = returned[0];
            return returned[1];
        };

        this.parseByIndicatorAndTime = function() {
            var returned = getHashTable(sortByYear, "indicatorCode", "year", "value", "countryName");
            myData.indicatorAndTime = returned[0];
            return returned[1];
        };

        this.parseByIndicatorAndRegion = function() {
            var returned = getHashTable(sortByYear, "indicatorCode", "countryName", "value", "year");
            myData.indicatorAndRegion = returned[0];
            return returned[1];
        };

        this.parseByTimeAndRegion = function() {
            var returned = getHashTable(sortByYear, "year", "countryName", "value", "indicatorCode");
            myData.timeAndRegion = returned[0];
            return returned[1];
        }

        var sortByYear = function(a,b) {
            return a.year - b.year;
        };

        var getHashTable = function(sortFunction, selectorProperty, itemProperty, valueProperty, xAxisValueProperty) {
            var xAxisValues = [];
            var hashTableSelector = new HashTable();
            for (var i = 0; i < json.length; i++) {
                var indicatorSelector = json[i][selectorProperty];
                if (!hashTableSelector.hasItem(indicatorSelector)) {
                    var filtered = json.filter(filterByIndicator);
                    filtered = filtered.sort(sortFunction);
                    var hashTable = new HashTable();
                    for (var j = 0; j < filtered.length; j++) {
                        if (hashTable.hasItem(filtered[j][itemProperty])) {
                            var values = hashTable.getItem(filtered[j][itemProperty]);
                            values.push(parseFloat(filtered[j][valueProperty]));
                        } else {
                            var values = [parseFloat(filtered[j][valueProperty])];
                        }
                        hashTable.setItem(filtered[j][itemProperty], values);
                        insertXAxisValue(filtered[j][xAxisValueProperty]);
                    }
                    hashTableSelector.setItem(json[i][selectorProperty], hashTable);
                }
            } return [hashTableSelector, xAxisValues];

            function filterByIndicator(element) {
                return element[selectorProperty] === indicatorSelector;
            }

            function insertXAxisValue(value) {
                if (xAxisValues.indexOf(value) < 0)
                    xAxisValues.push(value);
            }
        };
    }

    function Iterator(data) {

        this.byIndicator = function(indicator) {
            var myData = data.indicator;
            series.indicator = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.indicator, series.indicator, indicator);
        };

        this.byTime = function(time) {
            var myData = data.time;
            series.time = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.time, series.time, time);
        };

        this.byRegion = function(region) {
            var myData = data.region;
            series.region = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.region, series.region, region);
        };

        this.byIndicatorAndTime = function(indicator, time) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, indicator, time);
        };

        this.byIndicatorAndRegion = function(indicator, region) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, indicator, region);
        };

        this.byTimeAndRegion = function(time, region) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, time, region);
        };

        function ByOneFunctions() {
            var select;
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;

            this.createSelect = function(div, indicators) {
                select = document.createElement("select");
                div.appendChild(select);
                select.onchange = this.onIndicatorChanged;
                for(var i=0;i<indicators.length;i++) {
                    var option = document.createElement("option");
                    option.innerHTML = indicators[i];
                    select.appendChild(option);    
                }
            };

            this.drawSelectedIndicator = function(index, _mySeries, _div, _wrapperDiv, _indicators, newGraphic) {
                mySeries = _mySeries;
                div = _div;
                wrapperDiv = _wrapperDiv;
                indicators = _indicators;
                drawSelectedIndicator(index, newGraphic);
            };

            var drawSelectedIndicator = function(index, newGraphic) {
                options.series = mySeries[index];
                if (select.childNodes.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.remove();
                }
                var container = wesCountry.charts.multiChart(options, newGraphic, select);
                container.insertBefore(div, container.childNodes[0]);
                wrapperDiv.appendChild(container);
            }

            this.onIndicatorChanged = function() {
                var div = this.parentNode.parentNode;
                var wrapperDiv = div.parentNode;
                drawSelectedIndicator(select.selectedIndex, false);
                div.remove();
            };

            this.by = function(myData, xAxisValues, mySeries, indicatorFilter) {
                if (myData !== null) {
                    var div = document.createElement("div");
                    div.className = "indicatorSelector";
                    var indicators = indicatorFilter !== undefined ?
                                     myData.keys().array.filter(filterIndicator) :
                                     myData.keys().array;
                    for (var i = 0; i < indicators.length; i++) {
                        var countries = myData.getItem(indicators[i]).keys().array;
                        var seriesByIndicator = [];
                        for (var c = 0; c < countries.length; c++) {
                            seriesByIndicator.push({
                                name: countries[c],
                                values: myData.getItem(indicators[i]).getItem(countries[c])
                            });
                        }
                        mySeries.push(seriesByIndicator);
                    }
                    this.createSelect(div, indicators, countries);
                    var wrapperDiv = document.createElement("div");
                    setTablePosition();
                    options.xAxis.values = xAxisValues;
                    this.drawSelectedIndicator(0, mySeries, div, wrapperDiv, indicators);
                }

                function filterIndicator(element) {
                    return element === indicatorFilter;
                }

                function filterSecond(element) {
                    return element === secondFilter;
                }

                function setTablePosition() {
                    if (tablePosition === null) {
                        document.querySelector(options.container).appendChild(wrapperDiv);
                    }
                    else {
                        if (tablePosition.toLowerCase() === "above")
                            tableElement.insertAfter(wrapperDiv);
                        else if (tablePosition.toLowerCase() === "below")
                            tableElement.parentNode.insertBefore(wrapperDiv, tableElement);
                    }
                }   
            };
        }

        function ByTwoFunctions() {
            var select;
            var select2;
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;
            var secondIndicators;

            this.createSelect = function(div, indicators, secondIndicators) {
                select = document.createElement("select");
                select2 = document.createElement("select");
                div.appendChild(select);
                div.appendChild(select2);
                select.onchange = this.onIndicatorChanged;
                select2.onchange = this.onIndicatorChanged;
                for(var i=0;i<indicators.length;i++) {
                    var option = document.createElement("option");
                    option.innerHTML = indicators[i];
                    select.appendChild(option);    
                }
                for(var i=0;i<secondIndicators.length;i++) {
                    var option = document.createElement("option");
                    option.innerHTML = secondIndicators[i];
                    select2.appendChild(option);
                }
            };

            this.drawSelectedIndicator = function(index, index2, _mySeries, _div, _wrapperDiv, _indicators, _secondIndicators, newGraphic) {
                mySeries = _mySeries;
                div = _div;
                wrapperDiv = _wrapperDiv;
                indicators = _indicators;
                secondIndicators = _secondIndicators;
                drawSelectedIndicator(index, index2, newGraphic);
            };

            var drawSelectedIndicator = function(index, index2, newGraphic) {
                options.series = mySeries[index][index2];
                if (select.childNodes.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.remove();
                }
                if (select2.childNodes.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = secondIndicators[0];
                    select2.parentNode.insertBefore(element, select2);
                    select2.remove();
                }
                var container = wesCountry.charts.multiChart(options, newGraphic, select);
                container.insertBefore(div, container.childNodes[0]);
                wrapperDiv.appendChild(container);
            };

            this.onIndicatorChanged = function() {
                var div = this.parentNode.parentNode;
                var wrapperDiv = div.parentNode;
                drawSelectedIndicator(select.selectedIndex, select2.selectedIndex, false);
                div.remove();
            };

            this.by = function(myData, xAxisValues, mySeries, indicatorFilter, indicatorFilter2) {
                if (myData !== null) {
                    var div = document.createElement("div");
                    div.className = "indicatorSelector";
                    var indicators = indicatorFilter !== undefined ?
                                     myData.keys().array.filter(filterIndicator) :
                                     myData.keys().array;
                    for (var i = 0; i < indicators.length; i++) {
                        var countries = indicatorFilter2 !== undefined ?
                                        myData.getItem(indicators[i]).keys().array.filter(filterSecondIndicator) :
                                        myData.getItem(indicators[i]).keys().array;
                        var seriesByIndicator = [];
                        for (var c = 0; c < countries.length; c++) {
                            seriesByIndicator[c] = [];
                            seriesByIndicator[c].push({
                                name: countries[c],
                                values: myData.getItem(indicators[i]).getItem(countries[c])
                            });
                        }
                        mySeries.push(seriesByIndicator);
                    }
                    this.createSelect(div, indicators, countries);
                    var wrapperDiv = document.createElement("div");
                    setTablePosition();
                    options.xAxis.values = xAxisValues;
                    this.drawSelectedIndicator(0, 0, mySeries, div, wrapperDiv, indicators, countries);
                }

                function filterIndicator(element) {
                    return element === indicatorFilter;
                }

                function filterSecondIndicator(element) {
                    return element === indicatorFilter2;
                }

                function setTablePosition() {
                    if (tablePosition === null) {
                        document.querySelector(options.container).appendChild(wrapperDiv);
                    }
                    else {
                        if (tablePosition.toLowerCase() === "above")
                            tableElement.insertAfter(wrapperDiv);
                        else if (tablePosition.toLowerCase() === "below")
                            tableElement.parentNode.insertBefore(wrapperDiv, tableElement);
                    }
                }   
            };

        }

        
    }

    

})();
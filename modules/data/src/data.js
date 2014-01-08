Element.prototype.insertAfter = function(newNode) {
    this.parentNode.insertBefore(newNode, this.nextSibling);
};

Array.prototype.pushIfNotExist = function(element) {
    if(this.indexOf(element) < 0 )
        this.push(element);
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
    var times = [];
    var indicators = [];
    var regions = [];

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
            var returned = getHashTable(sortByYear, "indicatorCode", "countryName", "value", "year");
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
        };

        var sortByYear = function(a,b) {
            return a.year - b.year;
        };

        var getHashTable = function(sortFunction, selectorProperty, itemProperty, valueProperty, xAxisValueProperty) {
            var xAxisValues = [];
            var hashTableSelector = new HashTable();
            setTimes();
            setRegions();
            setIndicators();
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

            function setTimes() {
                setGeneric("year", times);
            }

            function setRegions() {
                setGeneric("countryName", regions);
            }

            function setIndicators() {
                setGeneric("indicatorCode", indicators);
            }

            function setGeneric(propertyName, array) {
                for(var i=0;i<json.length;i++)
                    array.pushIfNotExist(json[i][propertyName]);
            }
        };
    }

    function Iterator(data) {

        //selector = time or indicator or region
        this.selectBy = function(selector, graphicFunctionNames) {
            var select = document.createElement('select');
            var container = typeof options.container === "string" ? 
                    document.querySelector(options.container) : 
                    options.container;
            container.appendChild(select);
            var optionsValues;
            switch(selector) {
                case "indicator":
                    optionsValues = indicators;
                    break;
                case "time":
                    optionsValues = times;
                    break;
                case "region":
                    optionsValues = regions;
                    break;
            } for(var i=0;i<optionsValues.length;i++) {
                var option = document.createElement('option');
                option.innerHTML = optionsValues[i];
                select.appendChild(option);
            } 
            drawFilteredGraphics.bind(this)();
            select.onchange = drawFilteredGraphics.bind(this);

            function getAllModules() {
                return container.querySelectorAll(".chartDiv");
            }

            function drawFilteredGraphics() {
                var divs = getAllModules();
                var filters = {};
                filters[selector] = select.options[select.selectedIndex].innerHTML;
                wesCountry.charts.multiChartRemoveData(); //delete all previous series saved
                if(divs.length <= 0)
                    for(var i=0;i<graphicFunctionNames.length;i++)
                        this[graphicFunctionNames[i]+"Filtered"](filters);
                else
                    for(var i=0;i<divs.length;i++) {
                        divs[i].parentNode.parentNode.remove();
                        this[graphicFunctionNames[i]+"Filtered"](filters);
                    }
            }
        };

        this.byIndicator = function(indicator) {
            var myData = data.indicator;
            series.indicator = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.indicator, series.indicator, indicator);
        };

        this.byIndicatorFiltered = function(filters) {
            var myData = data.indicator;
            series.indicator = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.indicator, series.indicator, filters.indicator, filters.region, filters.time);
        };

        this.byTime = function(time) {
            var myData = data.time;
            series.time = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.time, series.time, time);
        };

        this.byTimeFiltered = function(filters) {
            var myData = data.time;
            series.time = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.time, series.time, filters.time, filters.region, filters.indicator);
        };

        this.byRegion = function(region) {
            var myData = data.region;
            series.region = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.region, series.region, region);
        };

        this.byRegionFiltered = function(filters) {
            var myData = data.region;
            series.region = [];
            var by = new ByOneFunctions();
            by.by(myData, xAxisValues.region, series.region, filters.region, filters.indicator, filters.time);
        };

        this.byIndicatorAndTime = function(indicator, time) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, indicator, time);
        };

        this.byIndicatorAndTimeFiltered = function(filters) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, filters.indicator, filters.time, filters.region);
        };

        this.byIndicatorAndRegion = function(indicator, region) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, indicator, region);
        };

        this.byIndicatorAndRegionFiltered = function(filters) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, filters.indicator, filters.region, filters.time);
        };

        this.byTimeAndRegion = function(time, region) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, time, region);
        };

        this.byTimeAndRegionFiltered = function(filters) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new ByTwoFunctions();
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, filters.time, filters.region, filters.indicator);
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

            this.drawSelectedIndicator = function(index, index2, _mySeries, _div, _wrapperDiv, _indicators, newGraphic) {
                mySeries = _mySeries;
                div = _div;
                wrapperDiv = _wrapperDiv;
                indicators = _indicators;
                drawSelectedIndicator(index, newGraphic);
            };

            var drawSelectedIndicator = function(index, newGraphic) {
                options.series = mySeries[index];
                if (select.options.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.remove();
                }
                var container = wesCountry.charts.multiChart(options, newGraphic, select);
                container.insertBefore(div, container.childNodes[0]);
                wrapperDiv.appendChild(container);
            };

            this.onIndicatorChanged = function() {
                var div = this.parentNode.parentNode;
                var wrapperDiv = div.parentNode;
                drawSelectedIndicator(select.selectedIndex, false);
                div.remove();
            };

            this.putSeriesByIndicator = function(myData, seriesByIndicator, indicators, countries, i, filter, xAxisValues) {
                var item = getIndexOfXValue();
                for (var c = 0; c < countries.length; c++) {
                    if(filter !== undefined) {
                        seriesByIndicator.push({
                            name: countries[c],
                            values: [myData.getItem(indicators[i]).getItem(countries[c])[item]]
                        });
                    } else {
                        seriesByIndicator.push({
                            name: countries[c],
                            values: myData.getItem(indicators[i]).getItem(countries[c])
                        });
                    }
                }

                function getIndexOfXValue() {
                    for(var i=0;i<xAxisValues.length;i++)
                        if(xAxisValues[i] === filter)
                            return i;
                }
            };

            this.by = new By().by;
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
                if (select.options.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.style.display="none";
                }
                if (select2.options.length === 1) {
                    var element = document.createElement("p");
                    element.innerHTML = secondIndicators[0];
                    select2.parentNode.insertBefore(element, select2);
                    select2.style.display="none";
                }
                drawSelectedIndicator(index, index2, newGraphic);
            };

            var drawSelectedIndicator = function(index, index2, newGraphic) {
                options.series = mySeries[index][index2];
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


            this.putSeriesByIndicator = function(myData, seriesByIndicator, indicators, countries, i, filter, xAxisValues) {
                var item = getIndexOfXValue();
                for (var c = 0; c < countries.length; c++) {
                    if(filter !== undefined) {
                        seriesByIndicator[c] = [];
                        seriesByIndicator[c].push({
                            name: countries[c],
                            values: [myData.getItem(indicators[i]).getItem(countries[c])[item]]
                        });
                    } else {
                        seriesByIndicator[c] = [];
                        seriesByIndicator[c].push({
                            name: countries[c],
                            values: myData.getItem(indicators[i]).getItem(countries[c])
                        });
                    }
                }

                function getIndexOfXValue() {
                    for(var i=0;i<xAxisValues.length;i++)
                        if(xAxisValues[i] === filter)
                            return i;
                }
            };

            this.by = new By().by;
        }

        function By() {
            this.by = function(myData, xAxisValues, mySeries, indicatorFilter, indicatorFilter2, indicatorFilter3) {
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
                        this.putSeriesByIndicator(myData, seriesByIndicator, indicators, countries, i, indicatorFilter3, xAxisValues);
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
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
            select.className = "globalSelect";
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
                return document.querySelectorAll(".chartDiv");
            }

            function getContainerModules() {
                return container.querySelectorAll(".chartDiv");
            }

            function getGlobalFilters() {
                var divs = document.querySelectorAll(".chartDiv");
                var containers = [];
                for(var i=0;i<divs.length;i++)
                        containers.pushIfNotExist(divs[i]
                            .parentNode.parentNode.parentNode);
                return containers;
            }

            function drawFilteredGraphics() {
                var allDivs = getAllModules();
                var divs = getContainerModules();
                var allContainers = getGlobalFilters();
                var filters = {};
                filters[selector] = select.options[select.selectedIndex].innerHTML;
                if(getContainerModules().length <= 0)
                    for(var i=0;i<graphicFunctionNames.length;i++)
                        this[graphicFunctionNames[i]+"Filtered"](filters);
                else {
                    var div = divs[0];
                    var index = allDivs.indexOf(div);
                    wesCountry.charts.multiChartRemoveData(index, divs.length);
                    var length = divs.length;
                    options.container = div.parentNode.parentNode.parentNode;
                    var indexes = [];
                    for(var i=0;i<length;i++) {
                        indexes.push(allDivs.indexOf(divs[i]));
                        divs[i].parentNode.parentNode.remove();
                    }
                    for(var j=0;j<length;j++) {
                        wesCountry.charts.setPushIndex(indexes[j]);
                        this[graphicFunctionNames[j]+"Filtered"](filters);
                        wesCountry.charts.setPushIndex("length");
                    }
                }
            }
        };

        this.byIndicator = function(indicator) {
            var myData = data.indicator;
            series.indicator = [];
            var by = new ByOneFunctions("indicatorSelect");
            by.by(myData, xAxisValues.indicator, series.indicator, indicator);
        };

        this.byIndicatorFiltered = function(filters) {
            var myData = data.indicator;
            series.indicator = [];
            var by = new ByOneFunctions("indicatorSelect");
            by.by(myData, xAxisValues.indicator, series.indicator, filters.indicator, filters.region, filters.time);
        };

        this.byTime = function(time) {
            var myData = data.time;
            series.time = [];
            var by = new ByOneFunctions("timeSelect");
            by.by(myData, xAxisValues.time, series.time, time);
        };

        this.byTimeFiltered = function(filters) {
            var myData = data.time;
            series.time = [];
            var by = new ByOneFunctions("timeSelect");
            by.by(myData, xAxisValues.time, series.time, filters.time, filters.region, filters.indicator);
        };

        this.byRegion = function(region) {
            var myData = data.region;
            series.region = [];
            var by = new ByOneFunctions("regionSelect");
            by.by(myData, xAxisValues.region, series.region, region);
        };

        this.byRegionFiltered = function(filters) {
            var myData = data.region;
            series.region = [];
            var by = new ByOneFunctions("regionSelect");
            by.by(myData, xAxisValues.region, series.region, filters.region, filters.indicator, filters.time);
        };

        this.byIndicatorAndTime = function(indicator, time) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByTwoFunctions("indicatorSelect", "timeSelect");
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, indicator, time);
        };

        this.byIndicatorAndTimeFiltered = function(filters) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByTwoFunctions("indicatorSelect", "timeSelect");
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, filters.indicator, filters.time, filters.region);
        };

        this.byIndicatorAndRegion = function(indicator, region) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByTwoFunctions("indicatorSelect", "regionSelect");
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, indicator, region);
        };

        this.byIndicatorAndRegionFiltered = function(filters) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByTwoFunctions("indicatorSelect", "regionSelect");
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, filters.indicator, filters.region, filters.time);
        };

        this.byTimeAndRegion = function(time, region) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new ByTwoFunctions("timeSelect", "regionSelect");
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, time, region);
        };

        this.byTimeAndRegionFiltered = function(filters) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new ByTwoFunctions("timeSelect", "regionSelect");
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, filters.time, filters.region, filters.indicator);
        };

        this.max = function(numberOfItems, indicator, time) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByMaxAndMin(numberOfItems, "max");
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, indicator, time);
        };

        this.min = function(numberOfItems, indicator, time) {
            var myData = data.indicatorAndTime;
            series.indicatorAndTime = [];
            var by = new ByMaxAndMin(numberOfItems, "min");
            by.by(myData, xAxisValues.indicatorAndTime, series.indicatorAndTime, indicator, time);
        };

        this.byOneElementChangingYears = function(indicator, region, time) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByOneElementChangingYears();
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, indicator, region);
        };

        this.statisticalAggregates = function(indicator, region) {
            var myData = data.indicatorAndRegion;
            series.indicatorAndRegion = [];
            var by = new ByStatisticalAggregates();
            by.by(myData, xAxisValues.indicatorAndRegion, series.indicatorAndRegion, indicator, region);
        };

        this.semaphore = function(colors, limits, time, region) {
            var myData = data.timeAndRegion;
            series.timeAndRegion = [];
            var by = new BySemaphore(colors, limits, "timeSelect", "regionSelect");
            by.by(myData, xAxisValues.timeAndRegion, series.timeAndRegion, time, region);
        };

        function ByOneFunctions(selectClass) {
            var select;
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;

            this.createSelect = function(div, indicators) {
                select = document.createElement("select");
                div.appendChild(select);
                select.onchange = this.onIndicatorChanged;
                select.className = selectClass;
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
                if (select.options.length <= 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.style.display = "none";
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

        function ByTwoFunctions(selectClass, select2Class) {
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
                select.className = selectClass;
                select2.className = select2Class;
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
                if (select.options.length <= 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.style.display="none";
                }
                if (select2.options.length <= 1) {
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

        function ByMaxAndMin(numberOfItems, method) {
            var select;
            var select2;
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;
            var secondIndicators;

            this.createSelect = function() {};

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
                var container = wesCountry.charts.multiChart(options, newGraphic, select);
                container.insertBefore(div, container.childNodes[0]);
                wrapperDiv.appendChild(container);
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
                var compare;
                if(method === "max")
                    compare = function(a,b) {
                        return a < b;
                    }
                else if(method === "min")
                    compare = function(a,b) {
                        return a > b;
                    }
                var series = seriesByIndicator[0][0].values;
                for(var i = 0; i < series.length; i++) {
                    for(var j = series.length; j > i; j--) {
                        if(compare(series[i], series[j])) {
                            var temp = series[i];
                            series[i] = series[j];
                            series[j] = temp;
                            temp = xAxisValues[i];
                            xAxisValues[i] = xAxisValues[j];
                            xAxisValues[j] = temp;
                        }
                    }
                }
                series = series.slice(0, numberOfItems);
                function getIndexOfXValue() {
                    for(var i=0;i<xAxisValues.length;i++)
                        if(xAxisValues[i] === filter)
                            return i;
                    }
            };

            this.by = new By().by;
        }

        function ByOneElementChangingYears() {
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;
            var secondIndicators;
            var years;
            var currentYear;
            var buttonBackward;
            var buttonForward;

            this.createSelect = function(div, indicators, secondIndicators) {
                var indicator = document.createElement("p");
                indicator.innerHTML = indicators[0];
                div.appendChild(indicator);
                var country = document.createElement("p");
                country.innerHTML = secondIndicators[0];
                div.appendChild(country);
                var controlDiv = document.createElement("div");
                div.appendChild(controlDiv);
                buttonBackward = document.createElement("button");
                buttonBackward.innerHTML = String.fromCharCode(8656);
                buttonBackward.disabled = true;
                buttonBackward.onclick = onPreviousYear;
                div.appendChild(buttonBackward);
                currentYear = document.createElement("div");
                currentYear.innerHTML = years[0];
                controlDiv.appendChild(currentYear);
                buttonForward = document.createElement("button");
                buttonForward.innerHTML = String.fromCharCode(8658);
                buttonForward.onclick = onNextYear;
                div.appendChild(buttonForward);
            };

            var onNextYear = function() {
                onYearChanged.bind(this)(1);
            };

            var onPreviousYear = function() {
                onYearChanged.bind(this)(-1);
            };

            var onYearChanged = function(advance) {
                var index = years.indexOf(currentYear.innerHTML)+advance;
                currentYear.innerHTML = years[index];
                var div = this.parentNode.parentNode;
                var wrapperDiv = div.parentNode;
                drawSelectedIndicator(0, index, false);
                div.remove();
                //disable buttons for avoiding errors
                if(index+1 >= years.length) {
                    buttonForward.disabled = true;
                    buttonBackward.disabled = false;
                } else if(index <= 0) {
                    buttonForward.disabled = false;
                    buttonBackward.disabled = true;
                } else {
                    buttonForward.disabled = false;
                    buttonBackward.disabled = false;
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
                var container = document.createElement("p");
                container.innerHTML = mySeries[index][index2][0].values[0];
                container.insertBefore(div, container.childNodes[0]);
                wrapperDiv.appendChild(container);
            };

            this.putSeriesByIndicator = function(myData, seriesByIndicator, indicators, countries, i, filter, xAxisValues) {
                for (var c = 0; c < xAxisValues.length; c++) {
                        seriesByIndicator[c] = [];
                        seriesByIndicator[c].push({
                            name: countries[0],
                            values: [myData.getItem(indicators[i]).getItem(countries[0])[c]]
                        });
                }
                years = xAxisValues;
            };

            this.by = new By().by;
        }

        function ByStatisticalAggregates() {
            var select;
            var select2;
            var mySeries;
            var div;
            var wrapperDiv;
            var indicators;
            var secondIndicators;

            this.createSelect = function() {};

            this.drawSelectedIndicator = function(index, index2, _mySeries, _div, _wrapperDiv, _indicators, _secondIndicators, newGraphic) {
                mySeries = _mySeries;
                div = _div;
                wrapperDiv = _wrapperDiv;
                indicators = _indicators;
                secondIndicators = _secondIndicators;
                drawSelectedIndicator(index, index2, newGraphic);
            };

            var drawSelectedIndicator = function(index, index2, newGraphic) {
                var series =  mySeries[0][0][0].values;
                var statitics = {};
                statitics.sum = series.reduce(function(a,b) {return a+b;});
                statitics.average = statitics.sum / series.length;
                statitics.max = series.reduce(function(a,b) {return a>b ? a : b});
                statitics.min = series.reduce(function(a,b) {return a<b ? a : b});
                series.sort();
                if(series.length % 2 == 0)
                    statitics.median = (series[series.length/2]+series[series.length/2-1])/2;
                else
                    statitics.median = series[(series.length-1) / 2];
                createStatiticsTable();

                function createStatiticsTable() {
                    var table = document.createElement("table");
                    var theader = document.createElement("thead");
                    table.appendChild(theader);
                    var tr = document.createElement("tr");
                    theader.appendChild(tr);
                    var headers = ["Statistical aggregate", "Value"];
                    for(var i=0;i<headers.length;i++) {
                        var td = document.createElement("td");
                        td.innerHTML = headers[i];
                        tr.appendChild(td);
                    }
                    var tbody = document.createElement("tbody");
                    table.appendChild(tbody);
                    for(var a in statitics) {
                        var tr = document.createElement("tr");
                        tbody.appendChild(tr);
                        var td = document.createElement("td");
                        td.innerHTML = a;
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.innerHTML = statitics[a];
                        tr.appendChild(td);
                    }
                    var container = typeof options.container === "string" ? 
                            document.querySelector(options.container) : 
                            options.container;
                    container.appendChild(table);
                }
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

        function BySemaphore(colors, limits, selectClass, select2Class) {
            var select;
            var select2;
            var mySeries;
            var div;
            var semaphoreDiv;
            var indicators;
            var secondIndicators;
            putLimitsIfNofDefined(); //create limits if not defined by the user
            putColorsIfNotDefined(); //create colors if not defined by the user

            function putLimitsIfNofDefined() {
                if(limits===undefined)
                    limits = []; 
                limits[0] = limits[0]===undefined ? 10 : limits[0];
                limits[1] = limits[1]===undefined ? 100 : limits[1];
            }

            function putColorsIfNotDefined() {
                if(colors===undefined)
                    colors = [];
                colors[0] = colors[0]===undefined ? "#00FF00" : colors[0];
                colors[1] = colors[1]===undefined ? "#FF8000" : colors[1];
                colors[2] = colors[2]===undefined ? "#FF0000" : colors[2];
            }

            this.createSelect = function(div, indicators, secondIndicators) {
                select = document.createElement("select");
                select2 = document.createElement("select");
                select.className = selectClass;
                select2.className = select2Class;
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
                if (select.options.length <= 1) {
                    var element = document.createElement("p");
                    element.innerHTML = indicators[0];
                    select.parentNode.insertBefore(element, select);
                    select.style.display="none";
                }
                if (select2.options.length <= 1) {
                    var element = document.createElement("p");
                    element.innerHTML = secondIndicators[0];
                    select2.parentNode.insertBefore(element, select2);
                    select2.style.display="none";
                }
                drawSelectedIndicator(index, index2, newGraphic);
            };

            var drawSelectedIndicator = function(index, index2, newGraphic) {
                var series =  mySeries[index][index2][0].values;
                createTable();

                function createTable() {
                    var table = document.createElement("table");
                    var tbody = document.createElement("tbody");
                    table.appendChild(tbody);
                    for(var i=0;i<series.length;i++) {
                        var tr = document.createElement("tr");
                        tbody.appendChild(tr);
                        var td = document.createElement("td");
                        td.innerHTML = xAxisValues.timeAndRegion[i];
                        tr.appendChild(td);
                        td = document.createElement("td");
                        if(series[i] <= limits[0]) 
                            td.style.backgroundColor = colors[0];
                        else if(series[i] > limits[0] && series[i] < limits[1])
                            td.style.backgroundColor = colors[1];
                        else
                            td.style.backgroundColor = colors[2];
                        td.innerHTML = series[i].toFixed(2);
                        tr.appendChild(td);
                    }
                    var container = typeof options.container === "string" ? 
                            document.querySelector(options.container) : 
                            options.container;
                    semaphoreDiv = document.createElement("div");
                    semaphoreDiv.className = "semaphoreDiv";
                    container.appendChild(semaphoreDiv);
                    semaphoreDiv.appendChild(div);
                    semaphoreDiv.appendChild(table);
                }
            };

            this.onIndicatorChanged = function() {
                semaphoreDiv.remove();
                drawSelectedIndicator(select.selectedIndex, select2.selectedIndex, false);
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
                        var container = typeof options.container === "string" ? 
                            document.querySelector(options.container) : 
                            options.container;
                        container.appendChild(wrapperDiv);
                    }
                    else {
                        if (tablePosition.toLowerCase() === "above")
                            tableElement.parentNode.insertBefore(wrapperDiv, tableElement);
                        else if (tablePosition.toLowerCase() === "below")
                            tableElement.insertAfter(wrapperDiv);
                    }
                }   
            };
        }
    }
})();
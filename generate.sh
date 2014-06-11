#!/bin/bash

cat ./util/*.js ./src/*.js ./modules/ajax/src/*.js ./modules/charts/src/*.js ./modules/data/src/*.js ./modules/table/src/js/*.js ./modules/selector/src/js/*.js ./modules/maps/src/js/*.js ./modules/loader/src/*.js ./modules/stateful/src/*.js > ./bin/wesCountry.js
cat ./src/*.css ./modules/table/src/css/*.css ./modules/charts/src/*.css ./modules/maps/src/css/*.css ./modules/selector/src/css/*.css ./modules/loader/src/*.css > ./bin/wesCountry.css

java -jar ./minify/compiler.jar --js ./bin/wesCountry.js --js_output_file ./bin/wesCountry.min.js --language_in ECMASCRIPT5
java -jar ./minify/yuicompressor-2.4.8.jar ./bin/wesCountry.css -o ./bin/wesCountry.min.css

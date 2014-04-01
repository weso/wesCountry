#!/bin/bash

cat ./util/*.js ./src/*.js ./modules/charts/src/*.js ./modules/data/src/*.js ./modules/table/src/js/*.js ./modules/selector/src/*.js > ./bin/wesCountry.js
cat ./modules/table/src/css/*.css > ./bin/wesCountry.css

java -jar ./minify/compiler.jar --js ./bin/wesCountry.js --js_output_file ./bin/wesCountry.min.js --language_in ECMASCRIPT5
java -jar ./minify/yuicompressor-2.4.8.jar ./bin/wesCountry.css -o ./bin/wesCountry.min.css
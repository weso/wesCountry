#!/bin/bash

cat ./util/*.js ./modules/charts/src/*.js ./modules/data/src/*.js ./modules/table/src/js/*.js ./modules/selector/src/*.js > ./bin/wesCountry.js
cat ./modules/table/src/css/*.css > ./bin/wesCountry.css

mkdir -p bin/images
cp -r modules/table/src/css/images/* bin/images

java -jar ~/Desarrollo/Util/minify/compiler.jar --js ./bin/wesCountry.js --js_output_file ./bin/wesCountry.min.js --language_in ECMASCRIPT5
java -jar ./minify/yuicompressor-2.4.8.jar ./bin/wesCountry.css -o ./bin/wesCountry.min.css
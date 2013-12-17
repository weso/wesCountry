#!/bin/bash

cat ./src/css/*.css > ./bin/table.css
cat ./src/js/*.js > ./bin/table.js
cp  src/css/images/*.* bin/images/*.*
nanojs ./bin/table.js ./bin/table.min.js
nanocss ./bin/table.css ./bin/table.min.css
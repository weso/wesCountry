#!/bin/bash

cat ./src/*.css > ./bin/Selector.css
cat ./src/*.js > ./bin/Selector.js
nanojs ./bin/Selector.js ./bin/Selector.min.js
nanocss ./bin/Selector.css ./bin/Selector.min.css
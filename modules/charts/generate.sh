#!/bin/bash

cat ./src/*.js > ./bin/charts.js
nanojs ./bin/charts.js ./bin/charts.min.js
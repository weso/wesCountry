#!/bin/bash

cat ./modules/charts/src/*.js > ./bin/wesCountry.js
nanojs ./bin/wesCountry.js ./bin/wesCountry.min.js
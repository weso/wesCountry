#!/bin/bash

cat ./src/*.js > ./bin/jGraf.js
nanojs ./bin/jGraf.js ./bin/jGraf.min.js
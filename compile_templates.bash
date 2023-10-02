#!/bin/bash

templates=$(find . -name "*.hbs")

for file in $templates
do
    ./node_modules/handlebars/bin/handlebars $file -f ${file/.hbs/.precompiled.js}
done
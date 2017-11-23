#!/bin/bash

SASS_FOLDER=three2fifteen/sass
CSS_FOLDER=three2fifteen/static/stylesheets
for f in `find $SASS_FOLDER -type f -name "*.scss"`
do
	echo $f
	tmp=${f/$SASS_FOLDER/$CSS_FOLDER}
	echo $tmp
	./bin/sass/bin/sass $f ${tmp/.scss/.css}
done

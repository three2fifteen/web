#!/bin/bash

SASS_FOLDER=three2fifteen/sass
CSS_FOLDER=three2fifteen/static/stylesheets
SASS=$(which sass)
if [ -z "$SASS" ]
then
	SASS=./bin/sass/bin/sass
fi

for f in `find $SASS_FOLDER -type f -name "*.scss"`
do
	echo $f
	tmp=${f/$SASS_FOLDER/$CSS_FOLDER}
	echo $tmp
	$SASS $f ${tmp/.scss/.css}
done

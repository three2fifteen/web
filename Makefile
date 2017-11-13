.PHONY: sass-install sass-watch sass-run

SASS_FOLDER := three2fifteen/sass
CSS_FOLDER := three2fifteen/static/stylesheets

sass-install:
	gem install -i ./bin/sass sass

sass-watch:
	@mkdir -p $(SASS_FOLDER) $(CSS_FOLDER)
	./bin/sass/bin/sass --watch $(SASS_FOLDER):$(CSS_FOLDER)

sass-run:
	@mkdir -p $(SASS_FOLDER) $(CSS_FOLDER)
	@./bin/generate-css.sh

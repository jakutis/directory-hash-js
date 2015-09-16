SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

lib: $(LIB)

lib/index.js: src/index.js
	mkdir -p $(@D)
	babel $< -o $@
	chmod +x lib/index.js

lib/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@
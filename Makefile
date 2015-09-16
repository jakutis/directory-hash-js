SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)
TEST = $(wildcard test/*.js)
TESTFOOBAR = $(TEST:test/%.js=testfoobar/%.js)
ROOT = $(shell pwd)

default: testfoobar lib

testfoobar: $(TESTFOOBAR)

testfoobar/%.js: test/%.js
	eslint --config $(ROOT)/.eslintrc --global describe,it  $<

lib: $(LIB)

lib/index.js: src/index.js
	mkdir -p $(@D)
	eslint --config $(ROOT)/.eslintrc  $<
	babel $< -o $@
	chmod +x lib/index.js

lib/%.js: src/%.js
	eslint --config $(ROOT)/.eslintrc  $<
	babel $< -o $@
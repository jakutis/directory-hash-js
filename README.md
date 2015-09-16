# directory-hash

Do stuff with file system directory trees, most often involving hashes - integrity checking, merging, etc.

[![Build Status](https://travis-ci.org/jakutis/directory-hash-js.svg?branch=master)](https://travis-ci.org/jakutis/directory-hash-js)

[![NPM](https://nodei.co/npm/directory-hash.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/directory-hash)
[![NPM](https://nodei.co/npm-dl/directory-hash.png?months=3&height=3)](https://www.npmjs.com/package/directory-hash)

## Installation

    npm install -g directory-hash

## Usage

    directory-hash --help

## Development 

1. Run `npm test` on each change in `src` or `test` directories.

## Releasing

1. Bump version in `CHANGELOG` and `package.json` files.
2. Run `npm publish`.
3. Run `git tag v1.2.3`.

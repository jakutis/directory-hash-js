# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [1.0.5] - 2015-12-05

### Added
- node-5 support
- very basic hash command implementation
- watch script

### Changed
- ES6 to ES5
- bin/main design
- testing infrastructure
- LICENSE from GPL-3.0 to ISC
- README structure

## [1.0.4] - 2015-09-16

### Fixed
- installation failure, which was caused by bin folder exclusion from package

## [1.0.3] - 2015-09-16

### Added
- ECMAScript source code linting
- Release process documentation

### Changed
- replace the manual `build` script with an automatic `prepublish` script

## [1.0.2] - 2015-09-16

### Added
- EditorConfig support

### Fixed
- removed stale documentation in `README`
- fixed links in `CHANGELOG`
- fixed Markdown syntax errors in `CHANGELOG`
- invoking of the CLI

## [1.0.1] - 2015-09-15

### Added
- Travis support
- NPM status images
- CLI
- `LICENSE`, `CHANGELOG` and `AUTHORS` files

### Fixed
- `npm test` while `/test` folder is empty
- include `/lib` folder in published NPM package

### Removed
- `npm run debug` script

[unreleased]: https://github.com/jakutis/directory-hash-js/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/jakutis/directory-hash-js/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/jakutis/directory-hash-js/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/jakutis/directory-hash-js/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/jakutis/directory-hash-js/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/jakutis/directory-hash-js/compare/v1.0.0...v1.0.1

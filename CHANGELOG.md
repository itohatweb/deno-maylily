# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2021-06-13

### Removed
* BigInteger dependency (Changed to native `BigInt`)

## [2.0.1] - 2020-12-21

### Added
* changelog
* jsdoc the MaylilyOptions interface
* explicit return types since unexplicit were not correct
* more badges to readme

### Changed
* Description of deno_maylily

### Fixed
* format errors in readme
* if generatorBits gets changed but not generatorId the id gets now updated automatically to use all the generatorBits

## [2.0.0] - 2020-12-20

### CHANGED

* default export of maylily() was removed
* improved jsdoc comments
* MaylilyOptions interface is now exported

## [1.0.0] - 2020-12-19

* First release.

[3.0.0]: https://github.com/itohatweb/deno-maylily/compare/2.0.1...3.0.0
[2.0.1]: https://github.com/itohatweb/deno-maylily/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/itohatweb/deno-maylily/compare/1.0.0...2.0.0
[1.0.0]: https://github.com/itohatweb/deno-maylily/compare/ddc05eca533dc2c753db793abccd4d5671d2d490...1.0.0

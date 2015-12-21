# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Fixed
* removed minified source from version control

## [0.4.0] - 2014-6-23
### Added
* bump geotrigger-js to v1.0.0
* consolidate browser and node versions into one file
* add test coverage! woo! using karma, mocha, chai

## [0.3.0] - 2014-2-19
### Breaking changes
* change namespace to `Geotrigger.Faker`, change project name on github and npm (**breaking change**)

### Fixed
* fix circle rendering in browser example (test for distance before geojson)

## [0.2.0] - 2013-12-18
### Added
* Add support for faking an existing device using refresh token ([#25](https://github.com/Esri/geofaker-js/issues/25))
* Emit `device:ready` event on session when initial `device/list` response is received to ensure `deviceId` and tags are attached to the device object
* Update browser example to allow use of refresh token


## [0.1.1] - 2013-11-19
### Fixed
* Remove XMLHttpRequest as a dependency since geotrigger-js already requires it
* Correct repository in package.json

## 0.1.0 - 2013-11-19

This marks the first public release of `Geofaker.js`.  This library is exclusively for testing and should not be used for any other purpose unless you really, really want to do that for some reason.



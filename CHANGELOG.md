# Geofaker.js Changelog

## v0.2.1
* Add proxy support ([#27](https://github.com/Esri/geofaker-js/issues/27))
* Bump geotrigger.js to v0.1.5 to fix auth timeout ([#28](https://github.com/Esri/geofaker-js/issues/28))

## v0.2.0
* Add support for faking an existing device using refresh token ([#25](https://github.com/Esri/geofaker-js/issues/25))
* Emit `device:ready` event on session when initial `device/list` response is received to ensure `deviceId` and tags are attached to the device object
* Update browser example to allow use of refresh token

## v0.1.1
* Remove XMLHttpRequest as a dependency since geotrigger-js already requires it
* Correct repository in package.json

## v0.1.0
* First public release

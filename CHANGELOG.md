# Geofaker.js Changelog

## v0.2.0

* Add support for faking an existing device using refresh token (#25)
* Emit `device:ready` event on session when initial `device/list` response is received to ensure `deviceId` and tags are attached to the device object
* Update browser example to allow use of refresh token

## v0.1.1

* Remove XMLHttpRequest as a dependency since geotrigger-js already requires it
* Correct repository in package.json

## v0.1.0

* First public release

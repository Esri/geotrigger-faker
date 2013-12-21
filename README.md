# Geofaker.js

Tiny utility to fake device updates when testing an application that uses the ArcGIS Geotrigger Service.

You can visit the [demo](http://esri.github.io/geofaker-js) (only works in browsers with CORS support).

## Features

* Register a new device using a valid ArcGIS Client ID
* Send location updates to test existing Geotrigger rules

## Instructions

### API

#### `Geofaker(options)`

Constructor function to register a device. Expects `options` to be an object with a required `clientId` property.

```js
var device = new Geofaker({ clientId: 'XXXXXX' });
```

You can also include an optional `refreshToken` property if you want to use an existing device. See the [refresh token section](#refresh-token) below for details on how to retrieve that information from a device.

```js
var device = new Geofaker({
  clientId: 'XXXXXX',
  refreshToken: 'XXXXXX'
});
```

A new session will be created using the [geotrigger.js](https://github.com/Esri/geotrigger-js) `Session` constructor and is made available as `.session` (so in the case of the example, it would be available as `device.session`). The session will also emit a `device:ready` event when the `deviceId` and `tags` have been attached to the device object.

##### Refresh Token

To retrieve a refresh token from an actual device set the Geotrigger SDK's log level to `Debug` and run your app on the device. Then search the logs for `refreshToken:`.

Setting the log level in the iOS SDK, put this line anywhere **before** your call to `setupWithClientId`:
``` objective-c
[AGSGTGeotriggerManager setLogLevel:AGSGTLogLevelDebug];
```
The following (or something similar, depending on whether your device was registered previously or not) will show up in your Console as one of the first things after calling `setupWithClientId`:
```
2013-12-20 15:19:54.786 [DEBUG  ][AGSGTDevice setClientId:withCompletion:]: Loaded device from disk: { 
  clientId:'XXXX', 
  deviceId:'YYYY', 
  accessToken:'ZZZZ', 
  refreshToken:'AAAA' 
}
```

#### `.send(update, callback)`

Method for spoofing device updates. The `update` parameter can be a single location object,
an array of location objects, or an array containing a latitude and longitude (i.e. `[0,0]`).

```js
device.send({
  latitude: 0,
  longitude: 0,
  accuracy: 10,
  trackingProfile: 'adaptive',
  timestamp: '2013-10-26T06:34:20.022Z'
}, function (error, response) {
  /* do something here */
});
```

#### `.setTags(tags, callback)`

Method for setting tags a device is subscribed to. Smart enough to ignore the device's unique tag (prefix `device:`).
Expects tags to be an array.

```js
device.setTags(['mr','cool','ice'], function (error, response) {
  /* do something here */
});
```

### Usage

#### Node.js

```js
var Geofaker = require('geofaker');

var faker = new Geofaker({
  clientId: 'XXXXXX'
});

var update = {
  longitude: -122.716598510742, // required
  latitude: 45.5780033058926, // required
  accuracy: 10.0, // optional, defaults to 10.0
  trackingProfile: 'adaptive' // optional, default to 'adaptive'
};

faker.send(update, function(error, response) {
  // do something
});
```

#### Browser

Geofaker.js relies on [Geotrigger.js](http://github.com/esri/geotrigger-js), which requires CORS support or a server-side proxy when running in a browser. Read more about browser support [here](https://github.com/Esri/geotrigger-js#browser-support).

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Geofaker</title>
</head>
<body>
  <script src="/path/to/geotrigger.js"></script>
  <script src="/path/to/geofaker.js"></script>
  <script>
    var faker = new Geofaker({
      clientId: 'XXXXXX'
    });

    var update = {
      longitude: -122.716598510742, // required
      latitude: 45.5780033058926, // required
      accuracy: 10.0, // optional, defaults to 10.0
      trackingProfile: 'adaptive' // optional, defaults to 'adaptive'
    };

    faker.send(update, function(error, response) {
      // do something
    });
  </script>
</body>
</html>
```

### Distributions

#### Node.js

Location: `/geofaker.js` (root)

#### Browser

Location: `/dist/browser/geofaker.js`

##### Notes

Both distributions depend on [geotrigger.js](https://github.com/esri/geotrigger-js).
You'll always need to include a copy of geotrigger.js when developing for browsers.

### Examples

#### Geofaker Web Application

A full-fledged client-side device location faker.

Location: `/examples/browser/`

The Geofaker web app can be used at [esri.github.io/geofaker-js](http://geoloqi.github.io/geofaker-js/).

#### Command Line

Location: `/examples/cli/cli.js`

Can be run with the following command, where XXXXXX is a valid Client ID:

```sh
$ node examples/cli/cli.js XXXXXX
```

Console logs a response from a dummy location update supplied in the script.
A quick way to ensure the library is working and the client ID is valid.

#### Reference

* [location objects](http://esri.github.io/geotrigger-docs/api/location/update/)

#### Todo

* Tests

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/geoloqi/geotrigger-editor/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's license.txt file.

[](Esri Tags: Geotrigger Device Test Testing Location Geolocation)
[](Esri Language: JavaScript Node.js)

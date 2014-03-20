# Geotrigger Faker

Geotrigger Faker is a tiny javascript utility to fake device updates when testing an application that uses the ArcGIS Geotrigger Service.

This is the open source version of the Geotrigger Faker available for Esri customers on the ArcGIS for Developers site. Read more about the faker [here](https://developers.arcgis.com/geotrigger-service/guide/geotrigger-faker/), and find out more about the Esri Geotrigger Service [here](https://developers.arcgis.com/en/features/geotrigger-service/).

## Features

* Register a new device using a valid ArcGIS Client ID
* Authenticate as a preexisting device using an ArcGIS Client ID and Refresh Token
* Send location updates to test existing Geotrigger rules

## Instructions

### API

#### `Geotrigger.Faker(options)`

Constructor function to register a device. Expects `options` to be an object with a required `clientId` property.

```js
var device = new Geotrigger.Faker({
  clientId: 'XXXXXX',      // required
  refreshToken: 'XXXXXXX', // optional
  proxy: '/path/to/proxy'  // optional
});
```

You can include an optional `refreshToken` property if you want to use an existing device. See the [refresh token section](#refresh-token) below for details on how to retrieve that information from a device.

If you need to use a proxy to support older browsers, you can supply the path to your proxy with the `proxy` property. See the section on [browser support](https://github.com/Esri/geotrigger-js#browser-support) in the Geotrigger.js README for more information.

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
var Geotrigger.Faker = require('geotrigger-faker');

var faker = new Geotrigger.Faker({
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

The Geotrigger.Faker library relies on [Geotrigger.js](http://github.com/esri/geotrigger-js), which requires CORS support or a server-side proxy when running in a browser. Read more about browser support [here](https://github.com/Esri/geotrigger-js#browser-support).

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Geotrigger Faker</title>
</head>
<body>
  <script src="/path/to/geotrigger.js"></script>
  <script src="/path/to/geotrigger-faker.js"></script>
  <script>
    var device = new Geotrigger.Faker({
      clientId: 'XXXXXX'
    });

    var update = {
      longitude: -122.716598510742, // required
      latitude: 45.5780033058926, // required
      accuracy: 10.0, // optional, defaults to 10.0
      trackingProfile: 'adaptive' // optional, defaults to 'adaptive'
    };

    device.send(update, function(error, response) {
      // do something
    });
  </script>
</body>
</html>
```

### Distributions

#### Node.js & Browser (one file to rule them all)

* Location: `/geotrigger-faker.js`
* Minified version: `/geotrigger-faker.min.js`

##### Notes

Geotrigger Faker depends on [geotrigger.js](https://github.com/esri/geotrigger-js). You'll always need to include a copy of geotrigger.js when developing for browsers. You'll also need a server-side proxy if you want to support non-CORS browsers like IE 8 and 9.

### Examples

#### Geotrigger Faker Web Application

A full-fledged client-side device location faker.

Location: `/examples/browser/`

#### Command Line

Location: `/examples/cli/cli.js`

Can be run with the following command, where XXXXXX is a valid Client ID:

```sh
$ node examples/cli/cli.js XXXXXX
```

Logs a response to the terminal from a dummy location update supplied in the script.
A quick way to ensure the library is working and the client ID is valid.

### Testing

This project uses [karma](https://github.com/karma-runner/karma) for client-side testing and [mocha](http://visionmedia.github.io/mocha/) for server-side testing. Tests can be run with [grunt](http://gruntjs.com/) using `grunt test` or independently using `karma start` and `mocha spec/fakerSpec.js`.

See a missing test? Open an issue, or better yet fork the project and open a pull request!

### Resources

* [location objects](https://developers.arcgis.com/geotrigger-service/api-reference/location-update/)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/esri/geotrigger-faker/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's license.txt file.

[](Esri Tags: Geotrigger Device Test Testing Location Geolocation)
[](Esri Language: JavaScript Node.js)

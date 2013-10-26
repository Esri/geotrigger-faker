# Geofaker.js

Tiny utility to fake device updates when testing an application that uses the ArcGIS Geotrigger Service.

## Usage

### Node.js

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

### Browser

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
      trackingProfile: 'adaptive' // optional, default to 'adaptive'
    };

    faker.send(update, function(error, response) {
      // do something
    });
  </script>
</body>
</html>
```

## Distributions

### Node.js

Location: `/geofaker.js` (root)

### Browser

Location: `/dist/browser/geofaker.js`

#### Notes

Both distributions require a local copy of [geotriggers.js](https://github.com/esri/geotriggers-js).
This dependency will be automatically included for node once both modules are published to npm,
but you'll always need to include a copy of geotriggers.js when developing for browsers.

## Examples

### Geofaker Web Application

A full-fledged client-side device location faker.

Location: `/examples/browser/`

The Geofaker web app can be used at [geoloqi.github.io/geofaker-js](http://geoloqi.github.io/geofaker-js/).

### Command Line

Location: `/examples/cli/cli.js`

Can be run with the following command, where XXXXXX is a valid Client ID:

```sh
$ node examples/cli/cli.js XXXXXX
```

Spits out response from a dummy update 

## Reference

* [location objects](http://esri.github.io/geotrigger-docs/api/location/update/)

## Todo

* Tests
* Remove [geotriggers.js](https://github.com/esri/geotriggers-js) from `lib/` (once it's published on npm)

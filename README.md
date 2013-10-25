# Geofaker.js

Tiny utility to register a device and send location updates to the ArcGIS Geotrigger Service.

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

faker.send(update, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});
```

### Browser

```js
var clientId = prompt('Client ID:');

var faker = new Geofaker({
  clientId: clientId
});

var update = {
  longitude: -122.716598510742, // required
  latitude: 45.5780033058926, // required
  accuracy: 10.0, // optional, defaults to 10.0
  trackingProfile: 'adaptive' // optional, default to 'adaptive'
};

faker.send(update, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});
```

## Distributions

### Node.js

Location: `/geofaker.js` (root)

### Browser

A full-fledged client-side device location spoofer.

Location: `/dist/browser/geofaker.js`

Requires [geotriggers.js](https://github.com/esri/geotriggers-js).

## Examples

### CLI

Location: `/examples/cli/cli.js`

Can be run with the following command, where XXXXXX is a valid Client ID:

```sh
$ node examples/cli/cli.js XXXXXX
```

### Browser

Location: `/examples/browser/index.html`

Can be run by serving the repo at the root directory with something like [nodefront](http://karthikv.github.io/nodefront/) or `python -m SimpleHTTPServer`.

## Reference

* [location objects](http://esri.github.io/geotrigger-docs/api/location/update/)

## Todo

* Remove [geotriggers.js](https://github.com/esri/geotriggers-js) from `lib/` (once it's published on npm)
* Move ArcGIS device registration logic to a separate repo

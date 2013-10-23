# Geofaker.js

Tiny utility to register a device and send location updates to the ArcGIS Geotrigger Service.

## Usage

### Node.js

```js
var Geofaker = require('geofaker');

var faker = new Geofaker({
  clientId: 'XXXXXX'
});

var locationObject = {
  'locations': [
    {
      // Float - latitude
      latitude: 0.0,

      // Float - longitude
      longitude: 0.0,

      // Integer - horizontal accuracy of GPS reading, in meters
      accuracy: 10,

      // String < ISO8601 > - timestamp of when the data was collected
      timestamp: '2012-05-09T16:03:53-0700',

       // String - the tracking profile of the SDK at the time of location collection
      trackingProfile: 'adaptive'
    }
  ]
};

faker.send(locationObject, function(error, response){
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

var payload = {
  'locations': [
    {
      latitude: 51.883333,
      longitude: -176.645,
      accuracy: 10.0,
      timestamp: '2012-05-09T16:03:53-0700',
      trackingProfile: 'adaptive'
    }
  ]
};

faker.send(payload, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});
```

## Distributions

### Node.js

Location: `/geofaker.js` (root)

### Browser

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

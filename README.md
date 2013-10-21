# Geofaker.js

Tiny utility to register a device and send location updates to the ArcGIS Geotrigger Service.

## Usage

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
  console.log(error, response);
});

```

That's it!

More info:

* [location objects](http://esri.github.io/geotrigger-docs/api/location/update/)

## Todo

* Remove [geotriggers.js](https://github.com/esri/geotriggers-js) from `lib/` (once it's published on npm)

// polyfills
// ---------

// Date.toISOString polyfill
// -------------------------
//
if ( !Date.prototype.toISOString ) {
  ( function() {

    function pad(number) {
      var r = String(number);
      if ( r.length === 1 ) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear()
        + '-' + pad( this.getUTCMonth() + 1 )
        + '-' + pad( this.getUTCDate() )
        + 'T' + pad( this.getUTCHours() )
        + ':' + pad( this.getUTCMinutes() )
        + ':' + pad( this.getUTCSeconds() )
        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
        + 'Z';
    };

  }() );
}

// defaults
// --------

var defaults = {};

// locationObject
// --------------
//
defaults.locationObject = {
  accuracy: 10.0,
  trackingProfile: 'adaptive'
};

// geofaker api (public)
// ---------------------

// constructor
// -----------
//
// usage: var faker = new Geofaker({ clientId: 'XXXXXX' });
//
function Geofaker (options) {

  // fail loudly and leave if something critical is missing
  if (!options.clientId) {
    console.log('Initialization Error: missing option "clientId"');
    return null;
  }

  // set things up
  this.clientId = options.clientId;
  this.session = new Geotriggers.Session({ clientId: this.clientId });
  this._sendQueue = [];

  return this;

}

// set device tags
// ---------------
//
// accepts an array of tags and a callback function
//
Geofaker.prototype.setTags = function (tags, callback) {

  var request = {
    // 'deviceIds': [this.deviceId],
    'setTags': tags
  };

  this.session.queue(function(){
    if (typeof callback === 'function') {
      this.request('device/update', request, callback);
    } else {
      this.request('device/update', request);
    }
  });

  return this;

};

// send location update
// --------------------
//
// usage: faker.send(locationObject, function(error, response){ /* do stuff */ });
//
// location update reference: http://esri.github.io/geotrigger-docs/api/location/update/
//
// locationObject required properties:
//
// * latitude
// * longitude
//
// callback is optional
//
Geofaker.prototype.send = function (options, callback) {

  var locations = parseSendOptions(options);

  sendLocationUpdate.apply(this, [ { locations: locations }, callback ]);

  return this;

};

// internal logic (private)
// ------------------------

function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function parseSendOptions (options) {
  var locations = [];

  if ( isObject(options) ) {
    locations.push( buildLocationObject(options) );
  }

  else if ( isArray(options) && isObject(options[0]) ) {
    for (var i=0; i < options.length; i++) {
      locations.push( buildLocationObject(options[i]) );
    }
  }

  else if ( isArray(options) && options.length === 2 && !isNaN(options[0]) && !isNaN(options[1]) ) {
    locations.push( buildLocationObject({
      latitude: options[0],
      longitude: options[1]
    }) );
  }

  else {
    throw new Error('invalid location options', options);
  }

  return locations;
}

function buildLocationObject (locationObject) {

  for (var prop in defaults.locationObject) {
    if (defaults.locationObject.hasOwnProperty(prop)) {
      if (prop in locationObject) { continue; }
      locationObject[prop] = defaults.locationObject[prop];
    }
  }

  if (typeof locationObject.timestamp === 'undefined') {
    var date = new Date();
    locationObject.timestamp = date.toISOString();
  }

  return locationObject;

}

function sendLocationUpdate (locations, callback) {

  // send locations to `location/update` using Geofaker's device ID
  if (typeof callback === 'function') {
    this.session.queue(function(){
      this.request('location/update', locations, callback);
    });
  } else {
    this.session.queue(function(){
      this.request('location/update', locations);
    });
  }

}

/*! geotrigger-faker - v0.3.0 - 2014-02-13
*   https://github.com/Esri/geotrigger-faker
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */

var Geotrigger = require('geotrigger-js');

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
      return this.getUTCFullYear() +
      '-' + pad( this.getUTCMonth() + 1 ) +
      '-' + pad( this.getUTCDate() ) +
      'T' + pad( this.getUTCHours() ) +
      ':' + pad( this.getUTCMinutes() ) +
      ':' + pad( this.getUTCSeconds() ) +
      '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 ) +
      'Z';
    };

  }() );
}

// defaults
// --------

var defaults = {};

function FNOP () {}

// locationObject
// --------------
//
defaults.locationObject = {
  accuracy: 10.0,
  trackingProfile: 'adaptive'
};

// Faker api (public)
// ---------------------

// constructor
// -----------
//
// usage: var faker = new Geotrigger.Faker(options);
//
// `options` is an object with a required clientId param and optional refreshToken param
//
function Faker (options) {

  // fail loudly and leave if something critical is missing
  if (!options || !options.clientId) {
    throw new Error('missing clientId');
  }

  // set things up
  var settings = {};
  settings.clientId = this.clientId = options.clientId;
  settings.persistSession = false;
  settings.proxy = options.proxy || false;

  // allow an existing device to be mimicked if a refresh token is provided
  if (options.refreshToken) {
    settings.refreshToken = this.refreshToken = options.refreshToken;
  }

  this.session = new Geotrigger.Session(settings);

  var self = this;

  this.session.queue(function(){
    this.request('device/list', function(error, response){
      // attach deviceId and tags to device object
      self.deviceId = response.devices[0].deviceId;
      self.tags = response.devices[0].tags;

      // emit device:ready event to allow users to attach a function
      self.session.emit('device:ready');
    });
  });

  this._sendQueue = [];

  return this;

}

// set device tags
// ---------------
//
// accepts an array of tags and a callback function
//
Faker.prototype.setTags = function (tags, callback) {

  callback = typeof callback === 'function' ? callback : FNOP;

  var request = { 'setTags': tags };

  this.session.queue(function(){
    this.request('device/update', request, callback);
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
Faker.prototype.send = function (options, callback) {

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

  // options is a location object
  if ( isObject(options) ) {
    locations.push( buildLocationObject(options) );
  }

  // options is an array of location objects
  else if ( isArray(options) && isObject(options[0]) ) {
    for (var i=0; i < options.length; i++) {
      locations.push( buildLocationObject(options[i]) );
    }
  }

  // options is a [lat,lng] array
  else if ( isArray(options) &&
            options.length === 2 &&
            !isNaN(options[0]) &&
            !isNaN(options[1]) ) {

    locations.push( buildLocationObject({
      latitude: options[0],
      longitude: options[1]
    }) );
  }

  else {
    throw new Error('invalid location options');
  }

  return locations;
}

function buildLocationObject (locationObject) {

  // merge defaults into locationObject
  for (var prop in defaults.locationObject) {
    if (defaults.locationObject.hasOwnProperty(prop)) {
      if (prop in locationObject) { continue; }
      locationObject[prop] = defaults.locationObject[prop];
    }
  }

  // provide a timestamp if it's missing
  if (typeof locationObject.timestamp === 'undefined') {
    var date = new Date();
    locationObject.timestamp = date.toISOString();
  }

  return locationObject;

}

function sendLocationUpdate (locations, callback) {

  callback = typeof callback === 'function' ? callback : FNOP;

  // send locations to `location/update` using Faker's device ID
  this.session.queue(function(){
    this.request('location/update', locations, callback);
  });

}

module.exports = Faker;

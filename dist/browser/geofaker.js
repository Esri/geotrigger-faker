(function(window, undefined){

var arcgis = {};

arcgis.registerDevice = function (clientId, callback) {

  var url = 'https://www.arcgis.com/sharing/oauth2/registerDevice';
  var params = 'client_id=' + clientId + '&f=json';
  var http = new XMLHttpRequest();

  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      try {
        var tokens = JSON.parse(http.responseText);
        callback(null, tokens);
      } catch(e) {
        callback(e);
      }
    }
  };

  http.send(params);

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

  // register a new fake device
  registerDevice.apply(this);

}

// send location update
// --------------------
//
// usage: faker.send(locationObject, function(error, response){ /* do stuff */ });
//
// location update reference: http://esri.github.io/geotrigger-docs/api/location/update/
//
// locationObject required params:
//
// * latitude
// * longitude
// * accuracy
// * timestamp
// * trackingProfile
//
Geofaker.prototype.send = function (locationObject, callback) {

  var args = Array.prototype.slice.apply(arguments);

  // send location update if device has been successfully registered
  if (typeof this.deviceId !== 'undefined') {
    sendLocationUpdate.apply(this, args);
  }

  // push send request to queue if registration isn't done
  else {
    this._sendQueue.push(args);
  }
}

// internal logic (private)
// ------------------------

function sendLocationUpdate (locationObject, callback) {

  // send locationObject to `location/update` using Geofaker's device ID
  if (typeof callback === 'function') {
    this.session.request('location/update', locationObject, callback);
  } else {
    this.session.request('location/update', locationObject);
  }

}

function registerDevice () {

  var self = this; // sorry.js :(

  arcgis.registerDevice(this.clientId, function(error, response){

    // fail loudly and leave if there's a registration error
    if (error) {
      console.log('Device Registration Error', error);
      return null;
    }

    // attach important info
    self.deviceId = response.device.deviceId;
    self.access_token = response.device.access_token;
    self.refresh_token = response.device.access_token;

    // just in case
    if (typeof self.deviceId !== 'undefined') {
      // send any updates that have been queued
      while (self._sendQueue.length) {
        self.send.apply(self, self._sendQueue.shift());
      }
    }

  });

}

window.Geofaker = Geofaker;

})(window);

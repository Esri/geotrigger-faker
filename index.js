var Geotriggers = require('./lib/geotriggers');
var arcgis = require('./lib/arcgis');

function Geofaker (options) {

  // fail loudly and leave
  if (!options.clientId) {
    console.log('Initialization Error: missing option "clientId"');
    return null;
  }

  // set things up
  this.clientId = options.clientId;
  this.session = new Geotriggers.Session({ clientId: this.clientId });
  this._sendQueue = [];

  console.log('session initialized');
  console.log('token: ' + this.session.token);

  // register a new fake device
  registerDevice.apply(this);

}

// private

function sendLocationUpdate (locationObject, callback) {
  console.log('sendLocationUpdate called');

  // send locationObject to `location/update` using Geofaker's device ID

  // fire a callback if one was supplied
  if (typeof callback === 'function') {
    callback();
  }

}

function registerDevice () {
  console.log('registerDevice called');

  var self = this; // sorry.js :(

  arcgis.registerDevice(this.clientId, function(error, response){
    console.log('device registered', error, response);

    // fail loudly and leave
    if (error) {
      console.log('Device Registration Error', error);
      return null;
    }

    // attach important info
    self.deviceId = response.device.deviceId;
    self.access_token = response.device.access_token;
    self.refresh_token = response.device.access_token;

    // send any updates that have been queued
    while (self._sendQueue.length) {
      console.log('emptying queue');
      self.send.apply(self, self._sendQueue.shift());
    }

  });

}

// public

Geofaker.prototype.send = function (locationObject, callback) {
  console.log('send called');

  var args = Array.prototype.slice.apply(arguments);

  // send location update if device has been successfully registered
  if (typeof this.deviceId !== 'undefined') {
    sendLocationUpdate(locationObject, callback);
  }

  // push send request to queue if registration isn't done
  else {
    this._sendQueue.push(args);
    console.log('send request ' + this._sendQueue.length + ' added to queue');
  }
}

module.exports = Geofaker;

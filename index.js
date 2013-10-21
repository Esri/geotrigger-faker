var Geotriggers = require('./lib/geotriggers');
var arcgis = require('./lib/arcgis');

function Geofaker (options) {
  if (!options.clientId) {
    console.log('Missing clientId');
    process.exit(1);
  }

  this._sendQueue = [];

  this.clientId = options.clientId;

  this.session = new Geotriggers.Session({
    clientId: this.clientId
  });

  this.registered = false;

  this._register();

}

Geofaker.prototype._register = function () {
  console.log('registering device');

  var self = this;

  arcgis.registerDevice(this.clientId, function(err, device){
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log('[device]', device);

    var tokens = {
      device_id: device.device.deviceId,
      access_token: device.deviceToken.access_token,
      refresh_token: device.deviceToken.refresh_token
    };

    self.registered = true;

    while (self._sendQueue.length) {
      console.log('emptying queue');

      self.send.apply(self, self._sendQueue.shift());
    }
  });
}

function sendLocationUpdate (locationObject, callback) {
  console.log('[sending]', locationObject);

  if (typeof callback === 'function') {
    callback();
  }
}

Geofaker.prototype.send = function (locationObject, callback) {
  var args = Array.prototype.slice.apply(arguments);

  if (this.registered === false) {
    this._sendQueue.push(args);
  } else {
    sendLocationUpdate(locationObject, callback);
  }
}

module.exports = Geofaker;
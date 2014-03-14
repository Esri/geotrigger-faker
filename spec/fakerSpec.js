if (typeof module === 'object') {
  var Geotrigger = require('geotrigger-js');
  var chai = require('chai');
  var assert = chai.assert;
  var config = require('./config');
  Geotrigger.Faker = require('../geotrigger-faker');
}

var fakeDevice, preexistingDevice;

var locationObject = {
  longitude: -122.716598510742,
  latitude: 45.5780033058926
};

var locationsArray = [
  {
    longitude: -122.716598510742,
    latitude: 45.5780033058926
  },
  {
    longitude: -122.712478637695,
    latitude: 45.6022688149858
  }
];

describe('Faker', function(){
  this.timeout(10000);

  describe('#constructor', function(){
    it('should throw an error if initialized without a clientId', function(){
      function noId () {
        new Geotrigger.Faker();
      }
      assert.throws(noId, /missing/);
    });

    fakeDevice = new Geotrigger.Faker({
      clientId: config.clientId
    });

    it('should fire an `authentication:success` event after initializing successfully with a clientId', function(done){
      fakeDevice.session.on('authentication:success', done);
    });

    it('should fire a `device:ready` event after initializing successfully with a clientId', function(done){
      fakeDevice.session.on('device:ready', function() {
        done();
      });
    });

    it('should have a deviceId, tags, and a refreshToken set after device:ready', function(){
      assert.isString(fakeDevice.deviceId);
      assert.isArray(fakeDevice.tags);
      assert.isString(fakeDevice.session.refreshToken);
    });

    it('should be able to use a clientId and refreshToken to authenticate as a preexisting device', function(done){
      // just in case the last one failed
      assert.isString(fakeDevice.session.refreshToken);

      preexistingDevice = new Geotrigger.Faker({
        clientId: config.clientId,
        refreshToken: fakeDevice.session.refreshToken
      });

      preexistingDevice.session.on('device:ready', function() {
        assert.equal(preexistingDevice.deviceId, fakeDevice.deviceId);
        done();
      });
    });
  });

  describe('#setTags', function(){
    it('should be able to set tags with a fake device', function(done){
      fakeDevice.setTags(['one','two','three'], done);
    });

    it('should be able to set tags with a preexisting device', function(done){
      preexistingDevice.setTags(['a','b','c'], done);
    });
  });

  describe('#send', function(){
    it('should be able to send a location object as a fake device', function(done){
      fakeDevice.send(locationObject, done);
    });

    it('should be able to send a location object as a preexisting device', function(done){
      preexistingDevice.send(locationObject, done);
    });

    it('should be able to send an array of locations as a fake device', function(done){
      fakeDevice.send(locationsArray, done);
    });

    it('should be able to send an array of locations as a preexisting device', function(done){
      preexistingDevice.send(locationsArray, done);
    });
  });
});

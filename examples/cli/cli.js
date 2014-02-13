// usage: node cli.js CLIENT_ID

var Faker = require('../../geotrigger-faker');

var options = process.argv.slice(2);

var clientId = options[0];

var device = new Faker({
  clientId: clientId
});

device.session.on('authentication:error', function(){
  console.log(arguments);
  process.exit(1);
});

var locationObject = {
  longitude: -122.716598510742,
  latitude: 45.5780033058926
};

console.log('attempting to send location object', locationObject);

device.send(locationObject, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});

var locationObjects = [
  {
    longitude: -122.716598510742,
    latitude: 45.5780033058926
  },
  {
    longitude: -122.712478637695,
    latitude: 45.6022688149858
  }
];

console.log('attempting to send location objects', locationObjects);

device.send(locationObjects, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});

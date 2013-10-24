// usage: node cli.js CLIENT_ID

var Geofaker = require('../../geofaker');

var options = process.argv.slice(2);

var clientId = options[0];

var faker = new Geofaker({
  clientId: clientId
});

console.log('sending location..');

faker.send({
  longitude: -122.716598510742,
  latitude: 45.5780033058926
}, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});

faker.send([
  {
    longitude: -122.716598510742,
    latitude: 45.5780033058926
  },
  {
    longitude: -122.712478637695,
    latitude: 45.6022688149858
  }
], function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});

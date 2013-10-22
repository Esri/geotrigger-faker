// usage: node cli.js CLIENT_ID

var Geofaker = require('../../geofaker');

var options = process.argv.slice(2);

var clientId = options[0];

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

console.log('sending location..');

faker.send(payload, function(error, response){
  console.log('error:', error);
  console.log('response:', response);
});

var Geofaker = require('../');

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

faker.send(payload, function(error, response){
  console.log(error, response);
});

var Geofaker = require('../');

var options = process.argv.slice(2);

var clientId = options[0];

var faker = new Geofaker({
  clientId: clientId
});

faker.send({
  latLng: 'blah'
});
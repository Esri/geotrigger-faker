var request = require('request');

function registerDevice (clientId, callback) {
  var headers = {};

  request({
    url: "https://www.arcgis.com/sharing/oauth2/registerDevice",
    headers: headers,
    method: "POST",
    form: {
      client_id: clientId,
      f: "json"
    }
  }, function(err, data){
    var tokens;
    try {
      tokens = JSON.parse(data.body);
      callback(null, tokens);
    } catch(e) {
      callback(e);
    }
  });
}

module.exports = {
  registerDevice: registerDevice
};
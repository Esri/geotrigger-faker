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

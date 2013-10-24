(function(window, undefined){

  var fake = {
    device: null,
    map: null,
    $: {}
  };

  var shapeOptions = {
    color: '#FF9843',
    opacity: 0.7,
    weight: 1,
    fill: true,
    fillOpacity: 0.4,
    triggerId: null,
    clickable: false
  };

  fake.Circle = L.Circle.extend({
    options: shapeOptions
  });

  function init () {
    fake.$.update = $('.location-update');
    fake.$.map    = $('.map-wrap');
    fake.$.device = $('.device');
    fake.$.id     = fake.$.device.find('.client-id');
    fake.$.tags   = fake.$.device.find('.tags');

    var update = {
      latitude: 51.883333,
      longitude: -176.645
    };

    fake.$.id.on('keypress', '#clientId', initDevice);
    fake.$.tags.on('keypress', '#tags', submitTags);

    fake.$.id.find('#clientId').focus();
  }

  function initDevice (event) {
    var $el = $(this);

    if ( (event.which !== 13) || ($el.val() === '') ) {
      return;
    }

    event.preventDefault();

    var clientId = $el.val();

    $el.attr('disabled','disabled');

    fake.device = new Geofaker({
      clientId: clientId
    });

    fake.device.session.on('authentication:error', function(){
      $el.removeAttr('disabled');
      fake.$.device.find('.page-header small').text('Authentication Error');
    });

    fake.device.session.queue(function(){
      if (!this.deviceId) {
        return;
      }

      fake.$.id.remove();

      fake.device.session.request('device/list', function(error, response){
        if (error) {
          console.log(error);
        }

        fake.$.tags.find('#tags')
          .val(response.devices[0].tags.join(', '))
          .removeAttr('disabled')
          .attr('placeholder','tags');
      });

      fake.$.tags.removeClass('hide');
      fake.$.device.find('.page-header').removeClass('hide');
      fake.$.device.find('.page-header small').text(this.deviceId);

      initMap();
    });
  }

  function submitTags (event) {
    var $el = $(this);

    if ( (event.which !== 13) || ($el.val() === '') ) {
      return;
    }

    event.preventDefault();

    var inputTags = $el.val().split(',');
    var tags = [];

    for (var i = 0; i < inputTags.length; i++) {
      if (inputTags[i].indexOf('device:') !== 0) {
        tags.push(inputTags[i].trim());
      }
    }

    $el.attr('disabled','disabled');

    fake.device.setTags(tags, function(error, response){
      if (error) {
        console.log(error);
      }

      else {
        $el.val(response.devices[0].tags.join(', ')).removeAttr('disabled');
      }
    });
  }

  function sendUpdate (latLng, callback) {
    fake.device.send(latLng, function(error, response){
      if (error) {
        callback(error, null);
      } else {
        callback(null, response);
      }
    });
  }

  function initMap () {
    fake.$.map.removeClass('hide');

    fake.map = L.map('map', {
      center: [0,0],
      zoom: 1,
      scrollWheelZoom: true,
      attributionControl: false,
      zoomControl: false
    });

    new L.Control.Zoom({ position: 'topright' }).addTo(fake.map);

    L.tileLayer('http://mapattack-tiles-{s}.pdx.esri.com/dark/{z}/{y}/{x}', {
      maxZoom: 18,
      subdomains: '0123'
    }).addTo(fake.map);

    fake.triggers = new L.FeatureGroup();

    fake.map.addLayer(fake.triggers);

    fake.device.session.request('trigger/list', function(error, response){
      console.log(error, response);

      var triggers = response.triggers;

      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].condition && triggers[i].condition.geo) {
          var geo = triggers[i].condition.geo;
          if (geo.geojson) {
            new L.GeoJSON(geo.geojson, {
              style: function(feature) {
                return shapeOptions;
              }
            }).addTo(fake.triggers);
          } else if (geo.distance) {
            new fake.Circle([geo.latitude, geo.longitude], geo.distance).addTo(fake.triggers);
          }
        }
      }

      var bounds = fake.triggers.getBounds();

      fake.map.fitBounds(bounds, {
        animate: false,
        paddingTopLeft: [0, 0]
      });
    });
  }

  $(init);

  window.fake = fake;

})(window);

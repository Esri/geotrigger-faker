(function(window, undefined){

  var fake = {
    $: {},
    device: null,
    map: null,
    tools: {}
  };

  var shapeOptions = {
    color: '#FF9843',
    opacity: 0.7,
    weight: 1,
    fill: true,
    fillOpacity: 0.4,
    triggerId: null,
    clickable: true
  };

  var editOptions = {
    showArea: false,
    shapeOptions: {
      color: '#00dcb1',
      opacity: 0.8,
      dashArray: '10, 10',
      weight: 2,
      fill: true,
      fillOpacity: 0.2
    }
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
      fake.$.device.find('.page-header small').text('ID: ' + this.deviceId);

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
    fake.locations = new L.FeatureGroup();

    fake.map.addLayer(fake.triggers);
    fake.map.addLayer(fake.locations);

    fake.device.session.request('trigger/list', function(error, response){
      var triggers = response.triggers;

      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].condition && triggers[i].condition.geo) {
          var geo = triggers[i].condition.geo;
          var layer;
          if (geo.geojson) {
            layer = new L.GeoJSON(geo.geojson, {
              style: function(feature) {
                return shapeOptions;
              }
            });
          } else if (geo.distance) {
            layer = new fake.Circle([geo.latitude, geo.longitude], geo.distance);
          }
          layer.bindPopup('tags: ' + triggers[i].tags.join(', ')).addTo(fake.triggers);
        }
      }

      var bounds = fake.triggers.getBounds();

      fake.map.fitBounds(bounds, {
        animate: false,
        paddingTopLeft: [0, 0]
      });

      initDraw();
    });
  }

  function initDraw () {
    fake.tools.radius = new L.Draw.Circle(fake.map, editOptions);

    fake.map.on('draw:created', function(event) {
      fake.$.update.removeAttr('disabled');

      var type = event.layerType;
      var layer = event.layer;
      var radius = Math.round(layer.getRadius());
      var latLng = layer.getLatLng();

      var options = {
        latitude: latLng.lat,
        longitude: latLng.lng,
        accuracy: radius
      };

      layer.addTo(fake.locations);

      sendUpdate(options, function(error, response){
        console.log(error, response);
        layer.setStyle({
          dashArray: null
        });
      });
    });

    fake.$.update.click(function(event) {
      event.preventDefault();
      fake.tools.radius.enable();
      fake.$.update.attr('disabled','disabled');
    });


    fake.$.update.removeClass('hide');
  }

  function sendUpdate (options, callback) {
    fake.device.send(options, function(error, response){
      if (error) {
        callback(error, null);
      } else {
        callback(null, response);
      }
    });
  }

  $(init);

  window.fake = fake;

})(window);

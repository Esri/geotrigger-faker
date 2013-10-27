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
    fake.$.id     = $('.client-id');
    fake.$.tags   = $('.tags');
    fake.$.title  = $('.title');

    var update = {
      latitude: 51.883333,
      longitude: -176.645
    };

    fake.$.id.on('keypress', '#clientId', initDevice);

    fake.$.tags.on('keypress', '#tags', function(event){
      var $el = $(this);
      if ( (event.which !== 13) || ($el.val() === '') ) {
        return;
      } else {
        event.preventDefault();
        setTags();
      }
    });

    fake.$.tags.on('click', '.setTags', function(event){
      var $el = fake.$.tags.find('#tags');
      if ($el.val() === '') {
        return;
      } else {
        event.preventDefault();
        setTags();
      }
    });

    fake.$.id.find('#clientId').focus();

    $('.toggle-console').click(function(e){
      e.preventDefault();
      $('.content').toggleClass('col-md-12 col-md-8');
      $('.console').toggleClass('hide col-md-4');
      fake.map.invalidateSize();
      $(this).find('i').toggleClass('fa-expand-o fa-collapse-o');
      $(this).find('.label').text('0').addClass('hide');
    });

    initMap();
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
      fake.$.title.find('small').text('Authentication Error');
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

        fake.$.tags.find('.setTags').removeAttr('disabled');
      });

      fake.$.tags.removeClass('hide');
      fake.$.update.removeClass('hide');
      fake.$.title.find('small').text('device id: ' + this.deviceId);

      getTriggers();
    });
  }

  function setTags () {
    var $el = fake.$.tags.find('#tags');

    var inputTags = $el.val().split(',');
    var tags = [];

    for (var i = 0; i < inputTags.length; i++) {
      var tag = inputTags[i].trim();
      if (tag.indexOf('device:') !== 0) {
        tags.push(tag);
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

    new L.Control.Zoom({ position: 'bottomleft' }).addTo(fake.map);

    L.tileLayer('http://mapattack-tiles-{s}.pdx.esri.com/dark/{z}/{y}/{x}', {
      maxZoom: 18,
      subdomains: '0123'
    }).addTo(fake.map);

    fake.triggers = new L.FeatureGroup();
    fake.locations = new L.FeatureGroup();

    fake.map.addLayer(fake.triggers);
    fake.map.addLayer(fake.locations);
  }

  function getTriggers () {
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
        var html;

        if (error) {
          html = '<span class="label label-danger">Error @ ' + new Date().toLocaleTimeString() + '</span>';
        } else {
          html = '<span class="label label-success">Response @ ' + new Date().toLocaleTimeString() + '</span>';
        }

        var str = JSON.stringify(error || response, undefined, 2);
        // output(str);
        $('.console')
          .stop(true,true)
          .append($('<p>').html(html))
          .append($('<pre>').html(str))
          .animate({ scrollTop: $('.console')[0].scrollHeight}, 500);

        if ( $('.console').hasClass('hide') ) {
          var $el = $('.toggle-console .label');
          var count = parseInt($el.text(), 10);
          count++;
          $el.text(count);
          $el.removeClass('hide');
        }

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


    fake.$.update.removeAttr('disabled');
  }

  function sendUpdate (options, callback) {
    options = options || {};
    options.trackingProfile = 'adaptive';
    options.timestamp = new Date().toISOString();

    var str = JSON.stringify({ locations: [options], token: fake.device.session.token }, undefined, 2);

    $('.console')
      .stop(true,true)
      .append($('<p>').html('<span class="label label-info">Request @ ' + new Date().toLocaleTimeString() + '</span>'))
      .append($('<pre>').html(str))
      .animate({ scrollTop: $('.console')[0].scrollHeight}, 500);

    if ( $('.console').hasClass('hide') ) {
      var $el = $('.toggle-console .label');
      var count = parseInt($el.text(), 10);
      count++;
      $el.text(count);
      $el.removeClass('hide');
    }

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

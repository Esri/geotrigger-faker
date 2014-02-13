(function (window, undefined) {

  var CORS = !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());

  var faker = {
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

  faker.Circle = L.Circle.extend({
    options: shapeOptions
  });

  function init () {

    if (CORS) {
      $('.toggle-console').removeClass('hide');
      $('.controls').removeClass('hide');
    } else {
      $('.jumbotron').removeClass('hide');
      return;
    }

    faker.$.update = $('.location-update');
    faker.$.map    = $('.map-wrap');
    faker.$.form   = $('.device-form');
    faker.$.tags   = $('.tags');
    faker.$.title  = $('.title');

    var update = {
      latitude: 51.883333,
      longitude: -176.645
    };

    faker.$.form.on('keypress', initDevice);

    faker.$.tags.on('keypress', '#tags', function(event){
      var $el = $(this);
      if ( (event.which !== 13) || ($el.val() === '') ) {
        return;
      } else {
        event.preventDefault();
        setTags();
      }
    });

    faker.$.tags.on('click', '.setTags', function(event){
      var $el = faker.$.tags.find('#tags');
      if ($el.val() === '') {
        return;
      } else {
        event.preventDefault();
        setTags();
      }
    });

    faker.$.form.find('#clientId').focus();

    $('.toggle-console').click(toggleConsole);

    initMap();
  }

  function toggleConsole (event) {
    event.preventDefault();

    var $el = $(this);

    $('.content').toggleClass('col-md-12 col-sm-12 col-md-8 col-sm-8');
    $('.console').toggleClass('hide col-md-4 col-sm-4');

    faker.map.invalidateSize();

    $el.find('i').toggleClass('fa-expand-o fa-collapse-o');
    $el.find('.label').text('0').addClass('hide');
  }

  function initDevice (event) {
    var $el = $(this);
    var $clientId = $el.find('#clientId');

    if ( (event.which !== 13) || ($clientId.val() === '') ) {
      return;
    }

    event.preventDefault();

    var clientId = $clientId.val();
    var refreshToken = $el.find('#refreshToken').val();

    var options = {
      clientId: clientId
    };

    if (!!refreshToken && refreshToken !== '') {
      options.refreshToken = refreshToken;
    }

    $el.find('input').attr('disabled','disabled');

    faker.device = new Geotrigger.Faker(options);

    faker.device.session.on('authentication:error', function(){
      $el.removeAttr('disabled');
      faker.$.title.find('small').text('Authentication Error');
    });

    faker.device.session.on('device:ready', function(){
      faker.$.form.remove();

      faker.$.tags.find('#tags')
        .val(faker.device.tags.join(', '))
        .removeAttr('disabled')
        .attr('placeholder','tags');

      faker.$.tags.find('.setTags').removeAttr('disabled');

      faker.$.tags.removeClass('hide');
      faker.$.update.removeClass('hide');
      faker.$.title.find('small').text('device id: ' + faker.device.deviceId);

      getTriggers();
    });
  }

  function setTags () {
    var $el = faker.$.tags.find('#tags');

    var inputTags = $el.val().split(',');
    var tags = [];

    for (var i = 0; i < inputTags.length; i++) {
      var tag = inputTags[i].trim();
      if (tag.indexOf('device:') !== 0) {
        tags.push(tag);
      }
    }

    $el.attr('disabled','disabled');

    faker.device.setTags(tags, function(error, response){
      if (error) {
        console.error(error);
        return;
      }

      $el.val(response.devices[0].tags.join(', ')).removeAttr('disabled');
    });
  }

  function initMap () {
    faker.$.map.removeClass('hide');

    faker.map = L.map('map', {
      center: [0,0],
      zoom: 2,
      scrollWheelZoom: true,
      zoomControl: false
    });

    new L.Control.Zoom({ position: 'bottomleft' }).addTo(faker.map);

    L.esri.basemapLayer('Streets').addTo(faker.map);

    faker.triggers = new L.FeatureGroup();
    faker.locations = new L.FeatureGroup();

    faker.map.addLayer(faker.triggers);
    faker.map.addLayer(faker.locations);
  }

  function getTriggers () {
    faker.device.session.request('trigger/list', function(error, response){
      var triggers = response.triggers;

      function getShapeOptions (feature) {
        return shapeOptions;
      }

      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].condition && triggers[i].condition.geo) {
          var geo = triggers[i].condition.geo;
          var layer;
          if (geo.distance) {
            layer = new faker.Circle([geo.latitude, geo.longitude], geo.distance);
          }
          else if (geo.geojson) {
            layer = new L.GeoJSON(geo.geojson, {
              style: getShapeOptions
            });
          }
          layer.bindPopup('tags: ' + triggers[i].tags.join(', ')).addTo(faker.triggers);
        }
      }

      var bounds = faker.triggers.getBounds();

      if (bounds.isValid()) {
        faker.map.fitBounds(bounds, {
          animate: false,
          paddingTopLeft: [0, 0]
        });
      }

      initDraw();
    });
  }

  function initDraw () {
    faker.tools.radius = new L.Draw.Circle(faker.map, editOptions);

    faker.map.on('draw:created', function(event) {
      faker.$.update.removeAttr('disabled');

      var type = event.layerType;
      var layer = event.layer;
      var radius = Math.round(layer.getRadius());
      var latLng = layer.getLatLng();

      var options = {
        latitude: latLng.lat,
        longitude: latLng.lng,
        accuracy: radius
      };

      layer.addTo(faker.locations);

      sendUpdate(options, function(error, response){
        var html;

        if (error) {
          html = '<span class="label label-danger">Error @ ' + new Date().toLocaleTimeString() + '</span>';
        } else {
          html = '<span class="label label-success">Response @ ' + new Date().toLocaleTimeString() + '</span>';
        }

        var str = JSON.stringify(error || response, undefined, 2);

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

    faker.$.update.click(function(event) {
      event.preventDefault();
      faker.tools.radius.enable();
      faker.$.update.attr('disabled','disabled');
    });

    faker.$.update.removeAttr('disabled');
  }

  function sendUpdate (options, callback) {
    options = options || {};
    options.trackingProfile = options.trackingProfile || 'adaptive';
    options.timestamp = options.timestamp || new Date().toISOString();

    var str = JSON.stringify({ locations: [options], token: faker.device.session.token }, undefined, 2);

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

    faker.device.send(options, function(error, response){
      if (error) {
        callback(error, null);
      } else {
        callback(null, response);
      }
    });
  }

  $(init);

})(window);

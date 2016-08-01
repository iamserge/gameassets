var Salmon = Salmon || {};
Salmon.Components = Salmon.Components || {};

Salmon.Components.GoogleMaps = function(node, items, options) {
  var map = null,
    bounds,
    config = {
      autoZoom: false,
      zoom: 9
    };

  init();

  function init() {
    if (!node && items.length === 0 && !google.maps.Map) return;

    $.extend(config, options);

    setupGoogleMap();
  }

  function setupGoogleMap() {
    if (items.length <= 0) return;

    config.autoZoom = (items.length > 1) ? config.autoZoom : false;

    var mapOptions = {
      zoom: config.zoom,
      // the word items in line 31 used to read "stores".
      // This is probably a typo as stores is never used in this function
      // but is used in the file that uses this function
      center: new google.maps.LatLng(items[0].lat, items[0].long),
      panControl: true,
      zoomControl: true,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(
      document.getElementById('storeMap'), mapOptions
    );

    if (config.autoZoom) {
      bounds = new google.maps.LatLngBounds();
    }

    var numberedMarkers = (items.length > 1) ? true : false;

    for (var i = 0; i < items.length; i++) {
      var latLng = new google.maps.LatLng(items[i].lat, items[i].long);
      if (config.autoZoom) {
        bounds.extend(latLng);
      }

      createGoogleMapMarker(latLng, items[i].name, items[i].message, false, (numberedMarkers) ? i + 1 : 0);
    }

    if (config.autoZoom) {
      map.fitBounds(bounds);
    }
  }

  function createGoogleMapMarker(point, name, message, userlocation, index) {
    var markerIconImage;

    if (index > 0) {
      markerIconImage = Salmon.Global.PageContext.IMAGEPATH + "markers/image" + index + ".png";
    } else {
      markerIconImage = Salmon.Global.PageContext.IMAGEPATH + "markers/image.png";
    }

    var markerIcon = {
      url: markerIconImage,
      size: new google.maps.Size(30, 36),
      anchor: google.maps.Point(15, 36),
      position: point
    };

    // David I have moved some of these to the marker but not all such as shadowSize, priceImage etc. These may need adding still
    //markerIcon.shadow = Salmon.Global.PageContext.IMAGEPATH + "markers/shadow.png";
    //markerIcon.iconSize = new google.maps.Size(30,36);
    //markerIcon.shadowSize = new google.maps.Size(48,36);
    //markerIcon.iconAnchor = new google.maps.Point(15,36);
    //markerIcon.infoWindowAnchor = new google.maps.Point(15,0);
    //markerIcon.printImage = Salmon.Global.PageContext.IMAGEPATH + "markers/printImage.gif";
    //markerIcon.mozPrintImage = Salmon.Global.PageContext.IMAGEPATH + "markers/mozPrintImage.gif";
    //markerIcon.printShadow = Salmon.Global.PageContext.IMAGEPATH + "markers/printShadow.gif";
    //markerIcon.transparent = Salmon.Global.PageContext.IMAGEPATH + "markers/transparent.png";
    //markerIcon.imageMap = [17,0,19,1,20,2,21,3,22,4,23,5,23,6,24,7,24,8,25,9,25,10,26,11,26,12,26,13,26,14,26,15,26,16,26,17,26,18,26,19,26,20,25,21,25,22,25,23,25,24,24,25,23,26,23,27,22,28,21,29,19,30,18,31,17,32,16,33,15,34,14,34,13,33,12,32,11,31,10,30,9,29,8,28,7,27,6,26,6,25,5,24,4,23,4,22,3,21,3,20,2,19,2,18,2,17,2,16,2,15,2,14,2,13,2,12,2,11,3,10,3,9,4,8,4,7,5,6,5,5,6,4,7,3,8,2,9,1,11,0];

    var marker = new google.maps.Marker({
      anchorPoint: point,
      position: point,
      icon: markerIcon,
      shadow: Salmon.Global.PageContext.IMAGEPATH + "markers/shadow.png",
      map: map
    });

    marker.setMap(map);

    var infoWindow = new google.maps.InfoWindow({
      position: point
    });

    google.maps.event.addListener(marker, 'click', function() {
      var overlayContent = document.createElement('div');

      overlayContent.id = 'overlayContent';
      overlayContent.innerHTML = message;
      infoWindow.setContent(overlayContent);
      infoWindow.open(map);
    });

    return marker;
  }

  function inverseOrder(marker) {
    return google.maps.Overlay.getZIndex(marker.getPoint().lat());
  }
};
